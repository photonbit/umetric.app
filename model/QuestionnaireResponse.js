// models/QuestionnaireResponse.js
import { Model } from '@nozbe/watermelondb';
import { date, relation, children } from '@nozbe/watermelondb/decorators';

export default class QuestionnaireResponse extends Model {
  static table = 'questionnaire_responses';

  @date('date_answered') dateAnswered;

  @relation('users', 'user_id') user;
  @relation('questionnaires', 'questionnaire_id') questionnaire;

  @children('responses') responses;
}
