// models/Event.js
import { Model } from '@nozbe/watermelondb';
import { field, children, relation } from '@nozbe/watermelondb/decorators';

export default class Event extends Model {
  static table = 'events';

  @field('name') name;
  @field('order') order;
  @field('icon') icon;
  @field('action') action;
  @field('active') active;

  // Belongs-to: each event belongs to a category
  @relation('categories', 'category_id') category;

  // Has-many: each event may have multiple logs and goals
  @children('events_logs') eventsLogs;
  @children('goals') goals;
}
