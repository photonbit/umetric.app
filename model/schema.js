// schema.js
import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const umetricSchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'users',
      columns: [
        { name: 'username', type: 'string', isOptional: false, isIndexed: true },
        { name: 'email', type: 'string', isOptional: false, isIndexed: true },
        { name: 'password', type: 'string', isOptional: true },
        // store timestamps as numbers (milliseconds since epoch)
        { name: 'created_at', type: 'number', isOptional: false },
        { name: 'first_name', type: 'string', isOptional: true },
        { name: 'last_name', type: 'string', isOptional: true },
        { name: 'active', type: 'boolean', isOptional: false, default: false },
        { name: 'is_admin', type: 'boolean', isOptional: false, default: false },
        { name: 'sunday_week_start', type: 'boolean', isOptional: false, default: false },
      ],
    }),
    tableSchema({
      name: 'categories',
      columns: [
        { name: 'name', type: 'string', isOptional: false },
        { name: 'order', type: 'number', isOptional: true },
        { name: 'icon', type: 'string', isOptional: true },
        { name: 'active', type: 'boolean', isOptional: false, default: true },
        { name: 'user_id', type: 'string', isOptional: false, isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'events',
      columns: [
        { name: 'name', type: 'string', isOptional: false, isIndexed: true },
        { name: 'order', type: 'number', isOptional: true, isIndexed: true },
        { name: 'icon', type: 'string', isOptional: true },
        { name: 'action', type: 'string', isOptional: true },
        { name: 'active', type: 'boolean', isOptional: false, default: true },
        { name: 'category_id', type: 'string', isOptional: false, isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'events_logs',
      columns: [
        { name: 'created_at', type: 'number', isOptional: false },
        // duration (e.g. seconds) is stored as a number; adjust as needed
        { name: 'duration', type: 'number', isOptional: true },
        { name: 'week', type: 'number', isOptional: false },
        { name: 'event_id', type: 'string', isOptional: false, isIndexed: true },
        { name: 'user_id', type: 'string', isOptional: false, isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'goals',
      columns: [
        { name: 'number', type: 'number', isOptional: false },
        { name: 'kind', type: 'string', isOptional: false, isIndexed: true },
        { name: 'active', type: 'boolean', isOptional: false, default: true },
        { name: 'event_id', type: 'string', isOptional: false, isIndexed: true },
        { name: 'user_id', type: 'string', isOptional: false, isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'questionnaires',
      columns: [
        { name: 'name', type: 'string', isOptional: false },
        { name: 'short_name', type: 'string', isOptional: false },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'instructions', type: 'string', isOptional: true },
        { name: 'source', type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'likert_scales',
      columns: [
        { name: 'questionnaire_id', type: 'string', isOptional: false, isIndexed: true },
        { name: 'choices', type: 'number', isOptional: false, default: 5 },
        { name: 'slope', type: 'number', isOptional: false, default: 1.0 },
        { name: 'intercept', type: 'number', isOptional: false, default: 0.0 },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'measure', type: 'string', isOptional: true },
        { name: 'lower_choice_label', type: 'string', isOptional: true },
        { name: 'upper_choice_label', type: 'string', isOptional: true },
        { name: 'middle_choice_label', type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'questions',
      columns: [
        { name: 'text', type: 'string', isOptional: false },
        { name: 'questionnaire_id', type: 'string', isOptional: false, isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'questionnaire_responses',
      columns: [
        { name: 'user_id', type: 'string', isOptional: false, isIndexed: true },
        { name: 'questionnaire_id', type: 'string', isOptional: false, isIndexed: true },
        { name: 'date_answered', type: 'number', isOptional: false },
      ],
    }),
    tableSchema({
      name: 'responses',
      columns: [
        { name: 'question_id', type: 'string', isOptional: false, isIndexed: true },
        { name: 'questionnaire_response_id', type: 'string', isOptional: false, isIndexed: true },
        { name: 'likert_scale_id', type: 'string', isOptional: false, isIndexed: true },
        { name: 'value', type: 'number', isOptional: false },
        { name: 'date', type: 'number', isOptional: false },
      ],
    }),
    // Join table for the many-to-many relation between questions and likert scales
    tableSchema({
      name: 'question_likert',
      columns: [
        { name: 'question_id', type: 'string', isOptional: false, isIndexed: true },
        { name: 'likert_scale_id', type: 'string', isOptional: false, isIndexed: true },
      ],
    }),
  ],
});
