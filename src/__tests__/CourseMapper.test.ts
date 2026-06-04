import {mapSupabaseToLocal} from '../features/courses/repository/CourseMapper';
import {SupabaseCourse} from '../features/courses/types';

const mockSupabaseCourse: SupabaseCourse = {
  course_id: 'RN-001',
  title: 'React Native App Development',
  description_short: 'Build cross-platform mobile apps using React Native.',
  instructor_id: 'INS-001',
  instructor_name: 'Prof. Anika',
  instructor_expertise_level: 'Senior Mobile Developer',
  duration_weeks: 8,
  price_usd: 49.99,
  is_premium: true,
  tags: ['React Native', 'Navigation', 'Mobile App'],
  rating: 4.8,
  last_updated: '2026-05-20T10:00:00Z',
};

describe('CourseMapper', () => {
  it('maps Supabase course to local DTO correctly', () => {
    const result = mapSupabaseToLocal(mockSupabaseCourse);

    expect(result.courseId).toBe('RN-001');
    expect(result.title).toBe('React Native App Development');
    expect(result.instructorName).toBe('Prof. Anika');
    expect(result.instructorExpertiseLevel).toBe('Senior Mobile Developer');
    expect(result.durationWeeks).toBe(8);
    expect(result.priceUsd).toBe(49.99);
    expect(result.isPremium).toBe(true);
    expect(result.tags).toEqual(['React Native', 'Navigation', 'Mobile App']);
    expect(result.rating).toBe(4.8);
  });

  it('handles null optional fields gracefully', () => {
    const courseWithNulls: SupabaseCourse = {
      ...mockSupabaseCourse,
      instructor_id: null,
      instructor_expertise_level: null,
    };

    const result = mapSupabaseToLocal(courseWithNulls);

    expect(result.instructorId).toBe('');
    expect(result.instructorExpertiseLevel).toBe('');
  });

  it('preserves tag array as-is', () => {
    const course: SupabaseCourse = {
      ...mockSupabaseCourse,
      tags: ['TypeScript', 'Offline', 'SQLite'],
    };

    const result = mapSupabaseToLocal(course);
    expect(result.tags).toHaveLength(3);
    expect(result.tags[0]).toBe('TypeScript');
  });
});
