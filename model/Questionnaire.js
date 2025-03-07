// models/Questionnaire.js
import { Model } from '@nozbe/watermelondb';
import { field, children, lazy } from '@nozbe/watermelondb/decorators';
import i18n from 'i18n-js';
import { Q } from '@nozbe/watermelondb';

export default class Questionnaire extends Model {
  static table = 'questionnaires';

  static associations = {
    questions: { type: 'has_many', foreignKey: 'questionnaire_id' },
    likert_scales: { type: 'has_many', foreignKey: 'questionnaire_id' },
    questionnaire_responses: { type: 'has_many', foreignKey: 'questionnaire_id' },
  };

  @field('name') name;
  @field('language') language;
  @field('short_name') shortName;
  @field('description') description;
  @field('instructions') instructions;
  @field('source') source;

  @children('questions') questions;
  @children('likert_scales') likertScales;
  @children('questionnaire_responses') questionnaireResponses;

  @lazy
  orderedQuestions = this.collections
    .get('questions')
    .query(
      Q.where('questionnaire_id', this.id),
      Q.sortBy('order', 'asc')
    );

  async getLocalizedInstance() {
    const systemLocale = i18n.locale;
    const ephemeral = {
      name: this.name,
      shortName: this.shortName,
      description: this.description,
      instructions: this.instructions,
      source: this.source,
      language: this.language,
    };
    if (this.language === systemLocale) {
      return ephemeral;
    }
    const results = await this.collections
      .get('questionnaire_translations')
      .query(
        Q.where('questionnaire_id', this.id),
        Q.where('language', systemLocale)
      )
      .fetch();
    if (results.length) {
      const translation = results[0];
      ephemeral.name = translation.name;
      ephemeral.description = translation.description;
      ephemeral.instructions = translation.instructions;
    }
    return ephemeral;
  }
}
