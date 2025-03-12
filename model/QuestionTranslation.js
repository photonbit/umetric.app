import { Model } from '@nozbe/watermelondb'
import { field, relation } from '@nozbe/watermelondb/decorators'

export default class QuestionTranslation extends Model {
  static table = 'question_translations'

  static associations = {
    questions: { type: 'belongs_to', key: 'question_id' },
  }

  @field('text') text
  @field('language') language

  @relation('questions', 'question_id') question
}
