// models/Question.js
import { Model } from '@nozbe/watermelondb';
import { Q } from '@nozbe/watermelondb';
import { field, relation, lazy } from '@nozbe/watermelondb/decorators';

export default class Question extends Model {
  static table = 'questions';

  static associations = {
    questionnaires: { type: 'belongs_to', key: 'questionnaire_id' },
    question_likert: { type: 'has_many', foreignKey: 'question_id' },
  };

  @field('order') order;
  @field('text') text;
  @field('language') language;

  @relation('questionnaires', 'questionnaire_id') questionnaire;

  @lazy
  likertScales = this.collections
    .get('likert_scales')
    .query(Q.on('question_likert', 'question_id', this.id));

  async getLocalizedInstance() {
    const systemLocale = i18n.locale;
    const ephemeral = {
      text: this.text,
      language: this.language,
      questionnaire_id: this.questionnaire_id,
      order: this.order,
    };
    if (this.language === systemLocale) {
      return ephemeral;
    }
    const results = await this.collections
      .get('question_translations')
      .query(Q.where('question_id', this.id), Q.where('language', systemLocale))
      .fetch();
    if (results.length) {
      const translation = results[0];
      ephemeral.text = translation.text;
    }
    return ephemeral;
  }
}
