// models/QuestionnaireResponse.js
import { Model } from '@nozbe/watermelondb'
import { date, relation, children, field } from '@nozbe/watermelondb/decorators'

export default class QuestionnaireResponse extends Model {
  static table = 'questionnaire_responses'

  static associations = {
    users: { type: 'belongs_to', key: 'user_id' },
    questionnaires: { type: 'belongs_to', key: 'questionnaire_id' },
    responses: { type: 'has_many', foreignKey: 'questionnaire_response_id' },
  }

  @date('date_answered') dateAnswered
  @field('language') language

  @relation('users', 'user_id') user
  @relation('questionnaires', 'questionnaire_id') questionnaire

  @children('responses') responses
}
