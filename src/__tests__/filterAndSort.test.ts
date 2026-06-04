import {CourseDTO, CourseFilters} from '../features/courses/types';

// Pure filter + sort logic extracted for unit testing
function applyFilters(courses: CourseDTO[], filters: CourseFilters): CourseDTO[] {
  let results = [...courses];

  if (filters.isPremium !== null) {
    results = results.filter(c => c.isPremium === filters.isPremium);
  }
  if (filters.isEnrolled !== null) {
    results = results.filter(c => c.isEnrolled === filters.isEnrolled);
  }
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
  tags: ['React Native', 'Mobile'],
  rating: 4.8,
  lastUpdated: '2026-05-20T10:00:00Z',
  isEnrolled: false,
  syncedAt: null,
};

const courses: CourseDTO[] = [
  baseCourse,
  {
    ...baseCourse,
    id: '2',
    courseId: 'JS-001',
    title: 'JavaScript Fundamentals',
    instructorName: 'John Doe',
    tags: ['JavaScript', 'Web'],
    isPremium: false,
    priceUsd: 0,
    rating: 4.2,
    durationWeeks: 4,
    isEnrolled: true,
  },
  {
    ...baseCourse,
    id: '3',
    courseId: 'TS-001',
    title: 'TypeScript Mastery',
    instructorName: 'Jane Smith',
    tags: ['TypeScript', 'Advanced'],
    isPremium: true,
    priceUsd: 79.99,
    rating: 4.5,
    durationWeeks: 12,
    isEnrolled: false,
  },
];

const defaultFilters: CourseFilters = {
  search: '',
  isPremium: null,
  isEnrolled: null,
  sortField: 'rating',
  sortOrder: 'desc',
};

describe('Filter and Sort Logic', () => {
  it('returns all courses with no filters applied', () => {
    const result = applyFilters(courses, defaultFilters);
    expect(result).toHaveLength(3);
  });

  it('filters by premium status', () => {
    const result = applyFilters(courses, {...defaultFilters, isPremium: true});
    expect(result).toHaveLength(2);
    result.forEach(c => expect(c.isPremium).toBe(true));
  });

  it('filters by free status', () => {
    const result = applyFilters(courses, {...defaultFilters, isPremium: false});
    expect(result).toHaveLength(1);
    expect(result[0].courseId).toBe('JS-001');
  });

  it('filters by enrolled status', () => {
    const result = applyFilters(courses, {...defaultFilters, isEnrolled: true});
    expect(result).toHaveLength(1);
    expect(result[0].courseId).toBe('JS-001');
  });

  it('searches by title', () => {
    const result = applyFilters(courses, {...defaultFilters, search: 'TypeScript'});
    expect(result).toHaveLength(1);
    expect(result[0].courseId).toBe('TS-001');
  });

  it('searches by instructor name', () => {
    const result = applyFilters(courses, {...defaultFilters, search: 'anika'});
    expect(result).toHaveLength(1);
    expect(result[0].courseId).toBe('RN-001');
  });

  it('searches by tag', () => {
    const result = applyFilters(courses, {...defaultFilters, search: 'mobile'});
    expect(result).toHaveLength(1);
    expect(result[0].courseId).toBe('RN-001');
  });

  it('sorts by rating descending', () => {
    const result = applyFilters(courses, {...defaultFilters, sortField: 'rating', sortOrder: 'desc'});
    expect(result[0].rating).toBeGreaterThanOrEqual(result[1].rating);
    expect(result[1].rating).toBeGreaterThanOrEqual(result[2].rating);
  });

  it('sorts by price ascending', () => {
    const result = applyFilters(courses, {...defaultFilters, sortField: 'price_usd', sortOrder: 'asc'});
    expect(result[0].priceUsd).toBeLessThanOrEqual(result[1].priceUsd);
    expect(result[1].priceUsd).toBeLessThanOrEqual(result[2].priceUsd);
  });

  it('sorts by duration descending', () => {
    const result = applyFilters(courses, {...defaultFilters, sortField: 'duration_weeks', sortOrder: 'desc'});
    expect(result[0].durationWeeks).toBeGreaterThanOrEqual(result[1].durationWeeks);
  });

  it('combines premium filter with search', () => {
    const result = applyFilters(courses, {
      ...defaultFilters,
      isPremium: true,
      search: 'TypeScript',
    });
    expect(result).toHaveLength(1);
    expect(result[0].courseId).toBe('TS-001');
  });

  it('returns empty array when no match', () => {
    const result = applyFilters(courses, {...defaultFilters, search: 'xyznotfound'});
    expect(result).toHaveLength(0);
  });
});
