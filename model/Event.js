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
  @field('category_id') category_id;

  // Belongs-to: each event belongs to a category
  @relation('categories', 'category_id') category;

  // Has-many: each event may have multiple logs and goals
  @children('event_logs') eventLogs;
  @children('goals') goals;
}
