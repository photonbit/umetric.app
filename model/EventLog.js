// models/EventLog.js
import { Model } from '@nozbe/watermelondb'
import { field, date, relation } from '@nozbe/watermelondb/decorators'
import { getISOWeek } from 'date-fns'

export default class EventLog extends Model {
  static table = 'event_logs'
  static associations = {
    events: { type: 'belongs_to', key: 'event_id' },
    users: { type: 'belongs_to', key: 'user_id' },
  }

  @date('created_at') createdAt
  @field('duration') duration
  @field('week') week

  @relation('events', 'event_id') event
  @relation('users', 'user_id') user

  static logEvent(database, eventId, durationSec) {
    return database.write(async () => {
      const logs = database.collections.get('event_logs')
      await logs.create((log) => {
        log.event_id = eventId
        log.week = getISOWeek(new Date())
        if (durationSec !== undefined) {
          log.duration = durationSec
        }
      })
    })
  }
}
