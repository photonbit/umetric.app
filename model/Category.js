// models/Category.js
import { Model } from '@nozbe/watermelondb';
import { field, children, relation } from '@nozbe/watermelondb/decorators';

export default class Category extends Model {
  static table = 'categories';

  @field('name') name;
  @field('order') order;
  @field('icon') icon;
  @field('active') active;

  // Belongs-to: each category is linked to a user
  @relation('users', 'user_id') user;

  // Has-many: each category may have many events
  @children('events') events;
}
