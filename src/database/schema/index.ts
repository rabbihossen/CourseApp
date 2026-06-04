import {appSchema, tableSchema} from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'courses',
      columns: [
        {name: 'course_id', type: 'string', isIndexed: true},
        {name: 'title', type: 'string'},
        {name: 'description_short', type: 'string'},
        {name: 'instructor_id', type: 'string', isOptional: true},
        {name: 'instructor_name', type: 'string'},
        {name: 'instructor_expertise_level', type: 'string', isOptional: true},
        {name: 'duration_weeks', type: 'number'},
        {name: 'price_usd', type: 'number'},
        {name: 'is_premium', type: 'boolean'},
        {name: 'tags', type: 'string'},
        {name: 'rating', type: 'number'},
        {name: 'last_updated', type: 'string'},
        {name: 'is_enrolled', type: 'boolean'},
        {name: 'synced_at', type: 'string', isOptional: true},
      ],
    }),
  ],
});
