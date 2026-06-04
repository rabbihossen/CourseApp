export interface SupabaseCourse {
  course_id: string;
  title: string;
  description_short: string;
  instructor_id: string | null;
  instructor_name: string;
  instructor_expertise_level: string | null;
  duration_weeks: number;
  price_usd: number;
  is_premium: boolean;
  tags: string[];
  rating: number;
  last_updated: string;
}

export interface CourseDTO {
  id: string;
  courseId: string;
  title: string;
  descriptionShort: string;
  instructorId: string;
  instructorName: string;
  instructorExpertiseLevel: string;
  durationWeeks: number;
  priceUsd: number;
  isPremium: boolean;
  tags: string[];
  rating: number;
  lastUpdated: string;
  isEnrolled: boolean;
  syncedAt: string | null;
}

export type SortField = 'rating' | 'price_usd' | 'duration_weeks';
export type SortOrder = 'asc' | 'desc';

export interface CourseFilters {
  search: string;
  isPremium: boolean | null;
  isEnrolled: boolean | null;
  sortField: SortField;
  sortOrder: SortOrder;
}
