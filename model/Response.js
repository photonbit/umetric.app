// models/Response.js
import { Model } from '@nozbe/watermelondb';
import { field, date, relation } from '@nozbe/watermelondb/decorators';

export default class Response extends Model {
  static table = 'responses';

  @field('value') value;
  @date('date') date;

  @relation('questions', 'question_id') question;
  @relation('questionnaire_responses', 'questionnaire_response_id') questionnaireResponse;
  @relation('likert_scales', 'likert_scale_id') likertScale;
}
