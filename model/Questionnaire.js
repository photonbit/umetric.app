// models/Questionnaire.js
import { Model } from '@nozbe/watermelondb';
import { field, children } from '@nozbe/watermelondb/decorators';

export default class Questionnaire extends Model {
  static table = 'questionnaires';

  @field('name') name;
  @field('short_name') shortName;
  @field('description') description;
  @field('instructions') instructions;
  @field('source') source;

  // Has-many relationships:
  @children('questions') questions;
  @children('likert_scales') likertScales;
  @children('questionnaire_responses') questionnaireResponses;
}
