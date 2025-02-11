// models/QuestionLikert.js
import { Model } from '@nozbe/watermelondb';
import { relation } from '@nozbe/watermelondb/decorators';

export default class QuestionLikert extends Model {
  static table = 'question_likert';

  @relation('questions', 'question_id') question;
  @relation('likert_scales', 'likert_scale_id') likertScale;
}
