import {CourseDTO} from '../features/courses/types';

// Simulate Zustand enrollment toggle logic (pure function)
function toggleEnrollmentInList(
  courses: CourseDTO[],
  courseId: string,
  enrolled: boolean,
): CourseDTO[] {
  return courses.map(c =>
    c.courseId === courseId ? {...c, isEnrolled: enrolled} : c,
  );
}

// Simulate that sync does NOT overwrite local enrollment
function mergeSyncedCourses(
  local: CourseDTO[],
  remote: Omit<CourseDTO, 'isEnrolled'>[],
): CourseDTO[] {
  return remote.map(r => {
    const existing = local.find(l => l.courseId === r.courseId);
    return {
      ...r,
      isEnrolled: existing?.isEnrolled ?? false,
    };
  });
}

const baseCourse: CourseDTO = {
  id: '1',
  courseId: 'RN-001',
  title: 'React Native App Development',
  descriptionShort: 'Build mobile apps.',
  instructorId: 'INS-001',
  instructorName: 'Prof. Anika',
  instructorExpertiseLevel: 'Senior',
  durationWeeks: 8,
  priceUsd: 49.99,
  isPremium: true,
  tags: ['React Native'],
  rating: 4.8,
  lastUpdated: '2026-05-20T10:00:00Z',
  isEnrolled: false,
  syncedAt: null,
};

const courses: CourseDTO[] = [
  baseCourse,
  {...baseCourse, id: '2', courseId: 'JS-001', title: 'JS Fundamentals', isEnrolled: false},
];

describe('Enrollment Logic', () => {
  it('marks course as enrolled', () => {
    const result = toggleEnrollmentInList(courses, 'RN-001', true);
    expect(result.find(c => c.courseId === 'RN-001')?.isEnrolled).toBe(true);
    expect(result.find(c => c.courseId === 'JS-001')?.isEnrolled).toBe(false);
  });

  it('marks course as unenrolled', () => {
    const enrolled = toggleEnrollmentInList(courses, 'RN-001', true);
    const result = toggleEnrollmentInList(enrolled, 'RN-001', false);
    expect(result.find(c => c.courseId === 'RN-001')?.isEnrolled).toBe(false);
  });

  it('does not affect other courses when toggling one', () => {
    const result = toggleEnrollmentInList(courses, 'RN-001', true);
    const otherCourses = result.filter(c => c.courseId !== 'RN-001');
    otherCourses.forEach(c => expect(c.isEnrolled).toBe(false));
  });

  it('sync does not overwrite local enrollment status', () => {
    const localWithEnrollment: CourseDTO[] = [
      {...baseCourse, isEnrolled: true},
    ];

    const remoteData: Omit<CourseDTO, 'isEnrolled'>[] = [
      {
        id: '1',
        courseId: 'RN-001',
        title: 'React Native App Development (Updated)',
        descriptionShort: 'Updated description.',
        instructorId: 'INS-001',
        instructorName: 'Prof. Anika',
        instructorExpertiseLevel: 'Principal Engineer',
        durationWeeks: 10,
        priceUsd: 59.99,
        isPremium: true,
        tags: ['React Native', 'New'],
        rating: 4.9,
        lastUpdated: '2026-06-01T10:00:00Z',
        syncedAt: new Date().toISOString(),
      },
    ];

    const merged = mergeSyncedCourses(localWithEnrollment, remoteData);

    // Remote data updated title/price but enrollment preserved
    expect(merged[0].isEnrolled).toBe(true);
    expect(merged[0].title).toBe('React Native App Development (Updated)');
    expect(merged[0].priceUsd).toBe(59.99);
  });

  it('new course from sync gets isEnrolled = false by default', () => {
    const emptyLocal: CourseDTO[] = [];
    const remoteData: Omit<CourseDTO, 'isEnrolled'>[] = [
      {
        id: '1',
        courseId: 'NEW-001',
        title: 'New Course',
        descriptionShort: 'Brand new.',
        instructorId: '',
        instructorName: 'Instructor X',
        instructorExpertiseLevel: '',
        durationWeeks: 4,
        priceUsd: 0,
        isPremium: false,
        tags: [],
        rating: 4.0,
        lastUpdated: '2026-06-01T10:00:00Z',
        syncedAt: new Date().toISOString(),
      },
    ];

    const merged = mergeSyncedCourses(emptyLocal, remoteData);
    expect(merged[0].isEnrolled).toBe(false);
  });
});
