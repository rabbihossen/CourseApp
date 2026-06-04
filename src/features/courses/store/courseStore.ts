import {create} from 'zustand';
import {CourseDTO, CourseFilters, SortField, SortOrder} from '../types';
import {
  getLocalCourses,
  syncFromSupabase,
  toggleEnrollment,
} from '../repository/CourseRepository';
import {networkService} from '../../../services/NetworkService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_SYNCED_KEY = '@course_app_last_synced';

interface CourseState {
  courses: CourseDTO[];
  filters: CourseFilters;
  isLoading: boolean;
  isSyncing: boolean;
  isOnline: boolean;
  error: string | null;
  lastSynced: string | null;

  loadCourses: () => Promise<void>;
  syncCourses: () => Promise<void>;
  setSearch: (search: string) => void;
  setIsPremiumFilter: (value: boolean | null) => void;
  setIsEnrolledFilter: (value: boolean | null) => void;
  setSortField: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
  enrollCourse: (courseId: string) => Promise<void>;
  unenrollCourse: (courseId: string) => Promise<void>;
  setOnlineStatus: (status: boolean) => void;
  loadLastSynced: () => Promise<void>;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  filters: {
    search: '',
    isPremium: null,
    isEnrolled: null,
    sortField: 'rating',
    sortOrder: 'desc',
  },
  isLoading: false,
  isSyncing: false,
  isOnline: true,
  error: null,
  lastSynced: null,

  loadCourses: async () => {
    set({isLoading: true, error: null});
    try {
      const courses = await getLocalCourses(get().filters);
      set({courses, isLoading: false});
    } catch (err: any) {
      set({error: err?.message ?? 'Failed to load courses', isLoading: false});
    }
  },

  syncCourses: async () => {
    const online = await networkService.checkConnection();
    if (!online) {
      set({isOnline: false});
      return;
    }
    set({isSyncing: true, isOnline: true});
    try {
      const result = await syncFromSupabase();
      if (result.success) {
        const now = new Date().toISOString();
        await AsyncStorage.setItem(LAST_SYNCED_KEY, now);
        set({lastSynced: now});
        // Reload from local after sync
        const courses = await getLocalCourses(get().filters);
        set({courses, isSyncing: false, error: null});
      } else {
        set({isSyncing: false, error: result.error ?? 'Sync failed'});
      }
    } catch (err: any) {
      set({isSyncing: false, error: err?.message ?? 'Sync error'});
    }
  },

  setSearch: (search: string) => {
    set(state => ({filters: {...state.filters, search}}));
    get().loadCourses();
  },

  setIsPremiumFilter: (isPremium: boolean | null) => {
    set(state => ({filters: {...state.filters, isPremium}}));
    get().loadCourses();
  },

  setIsEnrolledFilter: (isEnrolled: boolean | null) => {
    set(state => ({filters: {...state.filters, isEnrolled}}));
    get().loadCourses();
  },

  setSortField: (sortField: SortField) => {
    set(state => ({filters: {...state.filters, sortField}}));
    get().loadCourses();
  },

  setSortOrder: (sortOrder: SortOrder) => {
    set(state => ({filters: {...state.filters, sortOrder}}));
    get().loadCourses();
  },

  enrollCourse: async (courseId: string) => {
    // Optimistic update
    set(state => ({
      courses: state.courses.map(c =>
        c.courseId === courseId ? {...c, isEnrolled: true} : c,
      ),
    }));
    try {
      await toggleEnrollment(courseId, true);
    } catch (err: any) {
      // Rollback on failure
      set(state => ({
        courses: state.courses.map(c =>
          c.courseId === courseId ? {...c, isEnrolled: false} : c,
        ),
        error: err?.message ?? 'Enrollment failed',
      }));
      throw err;
    }
  },

  unenrollCourse: async (courseId: string) => {
    // Optimistic update
    set(state => ({
      courses: state.courses.map(c =>
        c.courseId === courseId ? {...c, isEnrolled: false} : c,
      ),
    }));
    try {
      await toggleEnrollment(courseId, false);
    } catch (err: any) {
      // Rollback on failure
      set(state => ({
        courses: state.courses.map(c =>
          c.courseId === courseId ? {...c, isEnrolled: true} : c,
        ),
        error: err?.message ?? 'Unenrollment failed',
      }));
      throw err;
    }
  },

  setOnlineStatus: (isOnline: boolean) => set({isOnline}),

  loadLastSynced: async () => {
    const stored = await AsyncStorage.getItem(LAST_SYNCED_KEY);
    set({lastSynced: stored});
  },
}));
