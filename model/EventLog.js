// models/EventLog.js
import { Model } from '@nozbe/watermelondb';
import { field, date, relation } from '@nozbe/watermelondb/decorators';

export default class EventLog extends Model {
  static table = 'events_logs';

  @date('created_at') createdAt;
  @field('duration') duration; // e.g. duration in seconds (or any numeric representation)
  @field('week') week;

  // Belongs-to: each log belongs to an event and a user
  @relation('events', 'event_id') event;
  @relation('users', 'user_id') user;
}
