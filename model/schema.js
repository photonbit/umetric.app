// schema.js
import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const umetricSchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'users',
      columns: [
        { name: 'username', type: 'string', isIndexed: true },
        { name: 'email', type: 'string', isIndexed: true },
        { name: 'password', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number'},
        { name: 'first_name', type: 'string', isOptional: true },
        { name: 'last_name', type: 'string', isOptional: true },
        { name: 'sunday_week_start', type: 'boolean'},
        { name: 'public_key', type: 'string', isOptional: true },
        { name: 'private_key', type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'categories',
      columns: [
        { name: 'name', type: 'string'},
        { name: 'order', type: 'number', isOptional: true },
        { name: 'icon', type: 'string', isOptional: true },
        { name: 'active', type: 'boolean'},
        { name: 'user_id', type: 'string', isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'events',
      columns: [
        { name: 'name', type: 'string', isIndexed: true },
        { name: 'order', type: 'number', isOptional: true, isIndexed: true },
        { name: 'icon', type: 'string', isOptional: true },
        { name: 'action', type: 'string', isOptional: true },
        { name: 'active', type: 'boolean'},
        { name: 'category_id', type: 'string', isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'event_logs',
      columns: [
        { name: 'created_at', type: 'number'},
        { name: 'duration', type: 'number', isOptional: true },
        { name: 'week', type: 'number'},
        { name: 'event_id', type: 'string', isIndexed: true },
        { name: 'user_id', type: 'string', isOptional: true, isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'goals',
      columns: [
        { name: 'number', type: 'number'},
        { name: 'kind', type: 'string', isIndexed: true },
        { name: 'active', type: 'boolean'},
        { name: 'event_id', type: 'string', isIndexed: true },
        { name: 'user_id', type: 'string', isOptional: true, isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'questionnaires',
      columns: [
        { name: 'name', type: 'string'},
        { name: 'language', type: 'string' },
        { name: 'short_name', type: 'string'},
        { name: 'description', type: 'string', isOptional: true },
        { name: 'instructions', type: 'string', isOptional: true },
        { name: 'source', type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'questionnaire_translations',
      columns: [
        { name: 'name', type: 'string'},
        { name: 'language', type: 'string' },
        { name: 'short_name', type: 'string'},
        { name: 'description', type: 'string', isOptional: true },
        { name: 'instructions', type: 'string', isOptional: true },
        { name: 'questionnaire_id', type: 'string', isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'likert_scales',
      columns: [
        { name: 'questionnaire_id', type: 'string', isIndexed: true },
        { name: 'language', type: 'string' },
        { name: 'choices', type: 'number'},
        { name: 'slope', type: 'number'},
        { name: 'intercept', type: 'number'},
        { name: 'description', type: 'string', isOptional: true },
        { name: 'measure', type: 'string', isOptional: true },
        { name: 'lower_choice_label', type: 'string', isOptional: true },
        { name: 'upper_choice_label', type: 'string', isOptional: true },
        { name: 'middle_choice_label', type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'likert_scale_translations',
      columns: [
        { name: 'likert_scale_id', type: 'string', isIndexed: true },
        { name: 'language', type: 'string' },
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
        { name: 'order', type: 'number'},
        { name: 'text', type: 'string'},
        { name: 'language', type: 'string' },
        { name: 'questionnaire_id', type: 'string', isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'question_translations',
      columns: [
        { name: 'question_id', type: 'string', isIndexed: true },
        { name: 'text', type: 'string'},
        { name: 'language', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'questionnaire_responses',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'questionnaire_id', type: 'string', isIndexed: true },
        { name: 'language', type: 'string' },
        { name: 'date_answered', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'responses',
      columns: [
        { name: 'question_id', type: 'string', isIndexed: true },
        { name: 'questionnaire_response_id', type: 'string', isIndexed: true },
        { name: 'likert_scale_id', type: 'string', isIndexed: true },
        { name: 'value', type: 'number'},
        { name: 'date', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'question_likert',
      columns: [
        { name: 'question_id', type: 'string', isIndexed: true },
        { name: 'likert_scale_id', type: 'string', isIndexed: true },
      ],
    }),
  ],
});