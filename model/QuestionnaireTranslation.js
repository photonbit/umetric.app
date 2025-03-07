import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';

export default class QuestionnaireTranslation extends Model {
  static table = 'questionnaire_translations';

  static associations = {
    questionnaires: { type: 'belongs_to', key: 'questionnaire_id' },
  };

  @field('name') name;
  @field('language') language;
  @field('short_name') shortName;
  @field('description') description;
  @field('instructions') instructions;

  @relation('questionnaires', 'questionnaire_id') questionnaire;
}
