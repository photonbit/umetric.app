// models/Goal.js
import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';

export default class Goal extends Model {
  static table = 'goals';

  @field('number') number;
  @field('kind') kind;
  @field('active') active;

  @relation('events', 'event_id') event;
  @relation('users', 'user_id') user;
}
