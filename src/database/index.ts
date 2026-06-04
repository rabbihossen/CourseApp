import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {schema} from './schema';
import {Course} from './models';

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'CourseAppDB',
  jsi: false,
  onSetUpError: error => {
    console.error('[DB] Setup error:', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [Course],
});

export {Course};
