import { Model } from '@nozbe/watermelondb'
import { field, relation } from '@nozbe/watermelondb/decorators'

export default class LikertScaleTranslation extends Model {
  static table = 'likert_scale_translations'

  static associations = {
    likert_scales: { type: 'belongs_to', key: 'likert_scale_id' },
  }

  @field('questionnaire_id') questionnaireId
  @field('language') language
  @field('description') description
  @field('measure') measure
  @field('lower_choice_label') lowerChoiceLabel
  @field('upper_choice_label') upperChoiceLabel
  @field('middle_choice_label') middleChoiceLabel

  @relation('likert_scales', 'likert_scale_id') likertScale
}
