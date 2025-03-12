// models/Goal.js
import { Model } from '@nozbe/watermelondb'
import { field, relation } from '@nozbe/watermelondb/decorators'

export default class Goal extends Model {
  static table = 'goals'

  static associations = {
    events: { type: 'belongs_to', key: 'event_id' },
    users: { type: 'belongs_to', key: 'user_id' },
  }

  @field('number') number
  @field('kind') kind
  @field('active') active
  @field('event_id') event_id

  @relation('events', 'event_id') event
  @relation('users', 'user_id') user
}
