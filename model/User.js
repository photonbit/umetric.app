// models/User.js
import { Model } from '@nozbe/watermelondb'
import { field, date, children } from '@nozbe/watermelondb/decorators'

export default class User extends Model {
  static table = 'users'

  static associations = {
    categories: { type: 'has_many', foreignKey: 'user_id' },
    event_logs: { type: 'has_many', foreignKey: 'user_id' },
    goals: { type: 'has_many', foreignKey: 'user_id' },
    questionnaire_responses: { type: 'has_many', foreignKey: 'user_id' },
  }

  @field('username') username
  @field('email') email
  @field('password') password
  @date('created_at') createdAt
  @field('first_name') firstName
  @field('last_name') lastName
  @field('sunday_week_start') sundayWeekStart

  @field('public_key') publicKey
  @field('private_key') privateKey

  @field('server_url') serverUrl
  @field('encryption_key') encryptionKey
  @field('sync_frequency') syncFrequency

  @children('categories') categories
  @children('event_logs') eventLogs
  @children('goals') goals
  @children('questionnaire_responses') questionnaireResponses
}
