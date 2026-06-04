import {Q} from '@nozbe/watermelondb';
import {database} from '../../../database';
import Course from '../../../database/models/Course';
import {supabase} from '../../../services/supabase';
import {CourseDTO, CourseFilters, SupabaseCourse} from '../types';
import {mapModelToDTO, mapSupabaseToLocal} from './CourseMapper';

const coursesCollection = database.get<Course>('courses');

export async function getLocalCourses(
  filters: CourseFilters,
): Promise<CourseDTO[]> {
  const clauses: Q.Clause[] = [];

  if (filters.isPremium !== null) {
    clauses.push(Q.where('is_premium', filters.isPremium));
  }
  if (filters.isEnrolled !== null) {
    clauses.push(Q.where('is_enrolled', filters.isEnrolled));
  }

  const raw = await coursesCollection.query(...clauses).fetch();

  let results = raw.map(mapModelToDTO);

  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      c =>
        c.title.toLowerCase().includes(q) ||
        c.instructorName.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q)),
    );
  }

  results.sort((a, b) => {
    let aVal: number;
    let bVal: number;
    switch (filters.sortField) {
      case 'price_usd':
        aVal = a.priceUsd;
        bVal = b.priceUsd;
        break;
      case 'duration_weeks':
        aVal = a.durationWeeks;
        bVal = b.durationWeeks;
        break;
      default:
        aVal = a.rating;
        bVal = b.rating;
    }
    return filters.sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  return results;
}

export async function getCourseById(courseId: string): Promise<CourseDTO | null> {
  const results = await coursesCollection
    .query(Q.where('course_id', courseId))
    .fetch();
  if (!results.length) return null;
  return mapModelToDTO(results[0]);
}

export async function syncFromSupabase(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const {data, error} = await supabase
      .from('courses')
      .select('*')
      .order('last_updated', {ascending: false});

    if (error) return {success: false, error: error.message};
    if (!data || !Array.isArray(data)) return {success: false, error: 'Invalid response shape'};

    const remoteItems = data as SupabaseCourse[];
    const now = new Date().toISOString();

    await database.write(async () => {
      for (const remote of remoteItems) {
        const existing = await coursesCollection
          .query(Q.where('course_id', remote.course_id))
          .fetch();

        const mapped = mapSupabaseToLocal(remote);

        if (existing.length > 0) {
          await existing[0].update(record => {
            record.title = mapped.title;
            record.descriptionShort = mapped.descriptionShort;
            record.instructorId = mapped.instructorId;
            record.instructorName = mapped.instructorName;
            record.instructorExpertiseLevel = mapped.instructorExpertiseLevel;
            record.durationWeeks = mapped.durationWeeks;
            record.priceUsd = mapped.priceUsd;
            record.isPremium = mapped.isPremium;
            record.tags = JSON.stringify(mapped.tags);
            record.rating = mapped.rating;
            record.lastUpdated = mapped.lastUpdated;
            record.syncedAt = now;
            // Preserve is_enrolled, never overwrite local user state
          });
        } else {
          await coursesCollection.create(record => {
            record.courseId = mapped.courseId;
            record.title = mapped.title;
            record.descriptionShort = mapped.descriptionShort;
            record.instructorId = mapped.instructorId;
            record.instructorName = mapped.instructorName;
            record.instructorExpertiseLevel = mapped.instructorExpertiseLevel;
            record.durationWeeks = mapped.durationWeeks;
            record.priceUsd = mapped.priceUsd;
            record.isPremium = mapped.isPremium;
            record.tags = JSON.stringify(mapped.tags);
            record.rating = mapped.rating;
            record.lastUpdated = mapped.lastUpdated;
            record.isEnrolled = false;
            record.syncedAt = now;
          });
        }
      }
    });

    return {success: true};
  } catch (err: any) {
    return {success: false, error: err?.message ?? 'Unknown error'};
  }
}

export async function toggleEnrollment(
  courseId: string,
  enrolled: boolean,
): Promise<void> {
  const results = await coursesCollection
    .query(Q.where('course_id', courseId))
    .fetch();
  if (!results.length) return;
  await database.write(async () => {
    await results[0].update(record => {
      record.isEnrolled = enrolled;
    });
  });
}

export function observeAllCourses() {
  return coursesCollection.query().observe();
}
