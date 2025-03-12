// models/QuestionLikert.js
import { Model } from '@nozbe/watermelondb'
import { relation } from '@nozbe/watermelondb/decorators'

export default class QuestionLikert extends Model {
  static table = 'question_likert'

  static associations = {
    questions: { type: 'belongs_to', key: 'question_id' },
    likert_scales: { type: 'belongs_to', key: 'likert_scale_id' },
  }

  @relation('questions', 'question_id') question
  @relation('likert_scales', 'likert_scale_id') likertScale
}
