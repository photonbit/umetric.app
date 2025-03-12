// models/Category.js
import { Model } from '@nozbe/watermelondb'
import { field, children, relation } from '@nozbe/watermelondb/decorators'

export default class Category extends Model {
  static table = 'categories'

  static associations = {
    users: { type: 'belongs_to', key: 'user_id' },
    events: { type: 'has_many', foreignKey: 'category_id' },
  }

  @field('name') name
  @field('order') order
  @field('icon') icon
  @field('active') active

  @relation('users', 'user_id') user
  @children('events') events
}
