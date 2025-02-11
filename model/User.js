// models/User.js
import { Model } from '@nozbe/watermelondb';
import { field, date, children } from '@nozbe/watermelondb/decorators';

export default class User extends Model {
  static table = 'users';

  @field('username') username;
  @field('email') email;
  @field('password') password;
  @date('created_at') createdAt;
  @field('first_name') firstName;
  @field('last_name') lastName;
  @field('active') active;
  @field('is_admin') isAdmin;
  @field('sunday_week_start') sundayWeekStart;

  // Has-many relationships:
  @children('categories') categories;
  @children('events_logs') eventsLogs;
  @children('goals') goals;
  @children('questionnaire_responses') questionnaireResponses;

  // A computed property similar to your full_name method:
  get fullName() {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }
}
