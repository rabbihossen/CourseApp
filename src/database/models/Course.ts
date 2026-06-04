import {Model} from '@nozbe/watermelondb';
import {field, text, date, readonly} from '@nozbe/watermelondb/decorators';

export default class Course extends Model {
  static table = 'courses';

  @text('course_id') courseId!: string;
  @text('title') title!: string;
  @text('description_short') descriptionShort!: string;
  @text('instructor_id') instructorId!: string;
  @text('instructor_name') instructorName!: string;
  @text('instructor_expertise_level') instructorExpertiseLevel!: string;
  @field('duration_weeks') durationWeeks!: number;
  @field('price_usd') priceUsd!: number;
  @field('is_premium') isPremium!: boolean;
  @text('tags') tags!: string;
  @field('rating') rating!: number;
  @text('last_updated') lastUpdated!: string;
  @field('is_enrolled') isEnrolled!: boolean;
  @text('synced_at') syncedAt!: string;

  get tagsArray(): string[] {
    try {
      return JSON.parse(this.tags || '[]');
    } catch {
      return [];
    }
  }
}
