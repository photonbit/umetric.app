// models/LikertScale.js
import { Model } from '@nozbe/watermelondb'
import { Q } from '@nozbe/watermelondb'
import { field, relation, lazy } from '@nozbe/watermelondb/decorators'
import i18n from 'i18n-js'

export default class LikertScale extends Model {
  static table = 'likert_scales'

  static associations = {
    questionnaires: { type: 'belongs_to', key: 'questionnaire_id' },
    question_likert: { type: 'has_many', foreignKey: 'likert_scale_id' },
    likert_scale_translations: { type: 'has_many', foreignKey: 'likert_scale_id' },
  }

  @field('language') language
  @field('choices') choices
  @field('slope') slope
  @field('intercept') intercept
  @field('description') description
  @field('measure') measure
  @field('lower_choice_label') lowerChoiceLabel
  @field('upper_choice_label') upperChoiceLabel
  @field('middle_choice_label') middleChoiceLabel

  @relation('questionnaires', 'questionnaire_id') questionnaire

  @lazy
  questions = this.collections
    .get('questions')
    .query(Q.on('question_likert', 'likert_scale_id', this.id), Q.sortBy('order', 'asc'))

  async getLocalizedInstance() {
    const systemLocale = i18n.locale
    const ephemeral = {
      choices: this.choices,
      slope: this.slope,
      intercept: this.intercept,
      description: this.description,
      measure: this.measure,
      lowerChoiceLabel: this.lowerChoiceLabel,
      upperChoiceLabel: this.upperChoiceLabel,
      middleChoiceLabel: this.middleChoiceLabel,
      questionnaire_id: this.questionnaire_id,
      language: this.language,
    }
    if (this.language === systemLocale) {
      return ephemeral
    }
    const results = await this.collections
      .get('likert_scale_translations')
      .query(Q.where('likert_scale_id', this.id), Q.where('language', systemLocale))
      .fetch()
    if (results.length) {
      const translation = results[0]
      ephemeral.description = translation.description
      ephemeral.lowerChoiceLabel = translation.lowerChoiceLabel
      ephemeral.upperChoiceLabel = translation.upperChoiceLabel
      ephemeral.middleChoiceLabel = translation.middleChoiceLabel
    }
    return ephemeral
  }
}
