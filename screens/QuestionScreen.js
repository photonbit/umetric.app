// screens/QuestionScreen.js
import React from 'react';
import { Text, View } from 'react-native';
import { withObservables, withDatabase } from '@nozbe/watermelondb/react';
import { mergeMap } from 'rxjs/operators';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import Question from '../components/Question';
import { Q } from '@nozbe/watermelondb'

function QuestionScreen({ navigation, route, questionRaw, localizedQuestion }) {
  const { questionnaire, responseId, questionIndex } = route.params;
  const likertScales = questionnaire.likert_scales.filter((scale) =>
    localizedQuestion?.likert_scale_ids?.includes(scale.id)
  );

  const handleSubmit = async (questionId, responses) => {
    for (const key of Object.keys(responses)) {
      await submitResponse(responseId, questionId, key, responses[key]);
    }
    if (questionIndex < questionnaire.questions.length - 1) {
      navigation.replace('Question', {
        questionnaire,
        responseId: responseId,
        questionIndex: questionIndex + 1,
      });
    } else {
      navigation.goBack();
    }
  };

  if (!localizedQuestion) return <View><Text>No question found</Text></View>;
  return (
    <View>
      <Text>{localizedQuestion.text}</Text>
      <Question
        question={localizedQuestion}
        likertScales={likertScales}
        onSubmit={handleSubmit}
      />
    </View>
  );
}

const enhance = withObservables(['route'], ({ route, database }) => {
  const questionId = route?.params?.question_id || '';
  return {
    questionRaw: database.collections.get('questions').findAndObserve(questionId),
    localizedQuestion: database.collections.get('questions').findAndObserve(questionId).pipe(
      mergeMap(async (q) => (q ? q.getLocalizedInstance() : null))
    ),
  };
});

export default withDatabase(enhance(QuestionScreen));
