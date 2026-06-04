import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useCourseStore} from '../store/courseStore';
import {useDebounce} from '../hooks/useDebounce';
import CourseCard from '../components/CourseCard';
import FilterBar from '../components/FilterBar';
import OfflineBanner from '../../shared/components/OfflineBanner';
import SkeletonCard from '../../shared/components/SkeletonCard';
import {CourseDTO} from '../types';
import {font, radius, spacing, text} from '../../../theme';
import {useTheme} from '../../../theme/ThemeContext';
import {useAuth} from '../../auth/AuthContext';
import {RootStackParamList} from '../../../navigation';
import {networkService} from '../../../services/NetworkService';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseList'>;

const CourseListScreen = ({navigation}: Props) => {
  const {colors, isDark, toggleTheme} = useTheme();
  const {signOut} = useAuth();
  const {
    courses,
    filters,
    isLoading,
    isSyncing,
    isOnline,
    error,
    lastSynced,
    loadCourses,
    syncCourses,
    setSearch,
    setIsPremiumFilter,
    setIsEnrolledFilter,
    setSortField,
    setSortOrder,
    setOnlineStatus,
    loadLastSynced,
  } = useCourseStore();

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 350);
  const initialized = useRef(false);

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={toggleTheme}
            style={styles.themeToggle}
            accessibilityRole="button"
            accessibilityLabel={
              isDark ? 'Switch to light mode' : 'Switch to dark mode'
            }>
            <Text style={styles.themeToggleIcon}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={signOut} style={styles.signOutBtn}>
            <Text style={[styles.signOutText, {color: colors.indigo}]}>
              Sign out
            </Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, signOut, colors, isDark, toggleTheme]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      loadLastSynced();
      loadCourses();
      syncCourses();
    }
  }, [loadCourses, loadLastSynced, syncCourses]);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  useEffect(() => {
    const unsub = networkService.subscribe(connected => {
      setOnlineStatus(connected);
    });
    return unsub;
  }, [setOnlineStatus]);

  const onRefresh = useCallback(async () => {
    try {
      await syncCourses();
    } catch {
      // error shown via store state, never crash
    }
  }, [syncCourses]);

  const renderItem = useCallback(
    ({item}: {item: CourseDTO}) => (
      <CourseCard
        course={item}
        onPress={() =>
          navigation.navigate('CourseDetail', {courseId: item.courseId})
        }
      />
    ),
    [navigation],
  );

  const keyExtractor = useCallback((item: CourseDTO) => item.courseId, []);

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyEmoji}>{error ? '⚠️' : '🔍'}</Text>
        <Text style={[styles.emptyTitle, {color: colors.text}]}>
          {error ? 'Something went wrong' : 'No courses found'}
        </Text>
        <Text style={[styles.emptyBody, {color: colors.textSecondary}]}>
          {error ?? 'Try adjusting your search or filters'}
        </Text>
      </View>
    );
  };

  const formattedSync = lastSynced
    ? new Date(lastSynced).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  const showSkeleton = isLoading && courses.length === 0;

  return (
    <View style={[styles.root, {backgroundColor: colors.background}]}>
      <OfflineBanner visible={!isOnline} />

      {/* Search bar */}
      <View style={[styles.searchWrap, {backgroundColor: colors.surface, borderBottomColor: colors.border}]}>
        <View style={[styles.searchBox, {backgroundColor: colors.gray50, borderColor: colors.border}]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, {color: colors.text}]}
            placeholder="Search courses, instructors, tags…"
            placeholderTextColor={colors.textMuted}
            value={searchInput}
            onChangeText={setSearchInput}
            returnKeyType="search"
            clearButtonMode="while-editing"
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Filter / sort chips */}
      <FilterBar
        isPremium={filters.isPremium}
        isEnrolled={filters.isEnrolled}
        sortField={filters.sortField}
        sortOrder={filters.sortOrder}
        onSetPremium={setIsPremiumFilter}
        onSetEnrolled={setIsEnrolledFilter}
        onSetSortField={setSortField}
        onSetSortOrder={setSortOrder}
      />

      {/* Sync status bar */}
      <View style={[styles.syncBar, {backgroundColor: colors.background}]}>
        <View style={styles.syncLeft}>
          {isSyncing && (
            <ActivityIndicator
              size="small"
              color={colors.indigo}
              style={styles.syncSpinner}
            />
          )}
          <Text style={[styles.syncText, {color: colors.textMuted}]}>
            {isSyncing
              ? 'Syncing…'
              : formattedSync
              ? `Synced ${formattedSync}`
              : 'Not yet synced'}
          </Text>
        </View>
        <Text style={[styles.countText, {color: colors.textMuted}]}>
          {courses.length} {courses.length === 1 ? 'course' : 'courses'}
        </Text>
      </View>

      {/* Content */}
      {showSkeleton ? (
        <View style={styles.skeletonList}>
          {Array.from({length: 5}).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      ) : (
        <FlashList
          data={courses}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listPadding}
          refreshControl={
            <RefreshControl
              refreshing={isSyncing && courses.length > 0}
              onRefresh={onRefresh}
              tintColor={colors.indigo}
              colors={[colors.indigo]}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {flex: 1},

  headerRight: {flexDirection: 'row', alignItems: 'center'},
  themeToggle: {paddingHorizontal: spacing[8], paddingVertical: spacing[4]},
  themeToggleIcon: {fontSize: 18},
  signOutBtn: {paddingHorizontal: spacing[8]},
  signOutText: {fontSize: 14, fontWeight: font.medium},

  searchWrap: {
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[10],
    borderBottomWidth: 1,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing[12],
    paddingVertical: spacing[8],
    gap: spacing[8],
  },
  searchIcon: {fontSize: 14},
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: font.regular,
    padding: 0,
  },

  syncBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[6],
  },
  syncLeft: {flexDirection: 'row', alignItems: 'center'},
  syncSpinner: {marginRight: spacing[6]},
  syncText: {
    fontSize: 11,
    fontWeight: font.medium,
  },
  countText: {
    fontSize: 11,
    fontWeight: font.medium,
  },

  listPadding: {paddingTop: spacing[8], paddingBottom: spacing[40]},
  skeletonList: {paddingTop: spacing[8]},

  emptyBox: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: spacing[32],
  },
  emptyEmoji: {fontSize: 40, marginBottom: spacing[16]},
  emptyTitle: {
    ...text.lg,
    fontWeight: font.semibold,
    textAlign: 'center',
    marginBottom: spacing[8],
  },
  emptyBody: {
    ...text.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default CourseListScreen;
