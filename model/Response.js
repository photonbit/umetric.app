// models/Response.js
import { Model } from '@nozbe/watermelondb';
import { field, date, relation } from '@nozbe/watermelondb/decorators';

export default class Response extends Model {
  static table = 'responses';

  static associations = {
    questions: { type: 'belongs_to', key: 'question_id' },
    questionnaire_responses: { type: 'belongs_to', key: 'questionnaire_response_id' },
    likert_scales: { type: 'belongs_to', key: 'likert_scale_id' },
  };

  @field('value') value;
  @date('date') date;

  @relation('questions', 'question_id') question;
  @relation('questionnaire_responses', 'questionnaire_response_id') questionnaireResponse;
  @relation('likert_scales', 'likert_scale_id') likertScale;
}
