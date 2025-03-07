// models/LikertScale.js
import { Model } from '@nozbe/watermelondb';
import { field, children, relation } from '@nozbe/watermelondb/decorators';

export default class LikertScale extends Model {
  static table = 'likert_scales';

  @field('choices') choices;
  @field('slope') slope;
  @field('intercept') intercept;
  @field('description') description;
  @field('measure') measure;
  @field('lower_choice_label') lowerChoiceLabel;
  @field('upper_choice_label') upperChoiceLabel;
  @field('middle_choice_label') middleChoiceLabel;

  @relation('questionnaires', 'questionnaire_id') questionnaire;

  // For the many-to-many with questions, you’ll need to query the join table:
  // e.g., this.collections.get('question_likert').query(Q.where('likert_scale_id', this.id));
}
