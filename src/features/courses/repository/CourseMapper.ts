import Course from '../../../database/models/Course';
import {CourseDTO, SupabaseCourse} from '../types';

export function mapModelToDTO(model: Course): CourseDTO {
  return {
    id: model.id,
    courseId: model.courseId,
    title: model.title,
    descriptionShort: model.descriptionShort,
    instructorId: model.instructorId,
    instructorName: model.instructorName,
    instructorExpertiseLevel: model.instructorExpertiseLevel,
    durationWeeks: model.durationWeeks,
    priceUsd: model.priceUsd,
    isPremium: model.isPremium,
    tags: model.tagsArray,
    rating: model.rating,
    lastUpdated: model.lastUpdated,
    isEnrolled: model.isEnrolled,
    syncedAt: model.syncedAt,
  };
}

export function mapSupabaseToLocal(
  remote: SupabaseCourse,
): Omit<CourseDTO, 'id' | 'isEnrolled' | 'syncedAt'> {
  return {
    courseId: remote.course_id,
    title: remote.title,
    descriptionShort: remote.description_short,
    instructorId: remote.instructor_id ?? '',
    instructorName: remote.instructor_name,
    instructorExpertiseLevel: remote.instructor_expertise_level ?? '',
    durationWeeks: remote.duration_weeks,
    priceUsd: remote.price_usd,
    isPremium: remote.is_premium,
    tags: remote.tags,
    rating: remote.rating,
    lastUpdated: remote.last_updated,
  };
}
