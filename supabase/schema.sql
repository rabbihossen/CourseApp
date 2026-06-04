-- Create courses table
create table if not exists courses (
  course_id text primary key,
  title text not null,
  description_short text not null,
  instructor_id text,
  instructor_name text not null,
  instructor_expertise_level text,
  duration_weeks int not null,
  price_usd numeric not null,
  is_premium boolean not null,
  tags text[] not null,
  rating numeric not null,
  last_updated timestamptz not null
);

-- Row Level Security: allow public read access
alter table courses enable row level security;

create policy "Allow public read access"
  on courses for select
  using (true);

-- Seed data: 10 course records
insert into courses values
  (
    'RN-001',
    'React Native App Development',
    'Build cross-platform mobile apps using React Native with Expo and bare workflow.',
    'INS-001',
    'Prof. Anika',
    'Senior Mobile Developer',
    8,
    49.99,
    true,
    ARRAY['React Native', 'Navigation', 'Mobile App'],
    4.8,
    '2026-05-20T10:00:00Z'
  ),
  (
    'JS-001',
    'JavaScript Fundamentals',
    'Master core JavaScript concepts from variables to async/await and modern ES2024 features.',
    'INS-002',
    'John Doe',
    'Full-Stack Engineer',
    4,
    0,
    false,
    ARRAY['JavaScript', 'Web', 'ES2024'],
    4.2,
    '2026-04-15T08:00:00Z'
  ),
  (
    'TS-001',
    'TypeScript Mastery',
    'Deep dive into TypeScript: generics, utility types, decorators, and advanced patterns.',
    'INS-003',
    'Jane Smith',
    'Principal Engineer',
    12,
    79.99,
    true,
    ARRAY['TypeScript', 'Advanced', 'Generics'],
    4.5,
    '2026-05-01T09:00:00Z'
  ),
  (
    'RX-001',
    'React Query & State Management',
    'Learn TanStack Query, Zustand, and modern data-fetching strategies for React apps.',
    'INS-004',
    'Carlos Rivera',
    'Frontend Architect',
    6,
    39.99,
    true,
    ARRAY['React', 'TanStack Query', 'Zustand', 'State Management'],
    4.7,
    '2026-05-10T11:00:00Z'
  ),
  (
    'DB-001',
    'SQLite & Offline-First Mobile',
    'Build resilient offline-first apps using SQLite, WatermelonDB, and sync strategies.',
    'INS-005',
    'Dr. Priya Nair',
    'Mobile Infrastructure Lead',
    10,
    59.99,
    true,
    ARRAY['SQLite', 'WatermelonDB', 'Offline', 'Sync'],
    4.6,
    '2026-05-25T12:00:00Z'
  ),
  (
    'GIT-001',
    'Git & GitHub for Developers',
    'Version control fundamentals, branching strategies, pull requests, and CI/CD basics.',
    'INS-006',
    'Alex Turner',
    'DevOps Engineer',
    3,
    0,
    false,
    ARRAY['Git', 'GitHub', 'DevOps', 'CI/CD'],
    4.1,
    '2026-03-10T07:00:00Z'
  ),
  (
    'API-001',
    'REST & GraphQL API Design',
    'Design and build production-grade REST and GraphQL APIs with Node.js and Supabase.',
    'INS-007',
    'Nina Patel',
    'Backend Engineer',
    7,
    44.99,
    false,
    ARRAY['REST', 'GraphQL', 'API Design', 'Node.js'],
    4.3,
    '2026-04-20T13:00:00Z'
  ),
  (
    'CSS-001',
    'Advanced CSS & Animations',
    'Master CSS Grid, Flexbox, custom properties, and GPU-accelerated animations.',
    'INS-008',
    'Sara Kim',
    'UI Engineer',
    5,
    29.99,
    false,
    ARRAY['CSS', 'Animations', 'UI', 'Flexbox'],
    4.0,
    '2026-02-28T10:00:00Z'
  ),
  (
    'ARCH-001',
    'Clean Architecture for Mobile',
    'Apply Clean Architecture, SOLID principles, and feature-based design to React Native apps.',
    'INS-001',
    'Prof. Anika',
    'Senior Mobile Developer',
    9,
    69.99,
    true,
    ARRAY['Architecture', 'Clean Code', 'SOLID', 'React Native'],
    4.9,
    '2026-06-01T08:00:00Z'
  ),
  (
    'AUTH-001',
    'Supabase Auth & Row Level Security',
    'Implement authentication, authorization, and RLS policies using Supabase in production apps.',
    'INS-009',
    'David Chen',
    'Security Engineer',
    6,
    54.99,
    true,
    ARRAY['Supabase', 'Auth', 'RLS', 'Security'],
    4.6,
    '2026-05-15T14:00:00Z'
  );
