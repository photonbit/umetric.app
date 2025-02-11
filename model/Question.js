// models/Question.js
import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';

export default class Question extends Model {
  static table = 'questions';

  @field('text') text;

  @relation('questionnaires', 'questionnaire_id') questionnaire;

  // For the many-to-many with likert scales, query the join table "question_likert"
  // to fetch related likert scales.
}
