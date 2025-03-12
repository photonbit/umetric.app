// models/Event.js
import { Model } from '@nozbe/watermelondb'
import { field, children, relation } from '@nozbe/watermelondb/decorators'

export default class Event extends Model {
  static table = 'events'

  static associations = {
    categories: { type: 'belongs_to', key: 'category_id' },
    event_logs: { type: 'has_many', foreignKey: 'event_id' },
    goals: { type: 'has_many', foreignKey: 'event_id' },
  }

  @field('name') name
  @field('order') order
  @field('icon') icon
  @field('action') action
  @field('active') active
  @field('category_id') category_id

  @relation('categories', 'category_id') category
  @children('event_logs') eventLogs
  @children('goals') goals
}
