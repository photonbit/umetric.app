// screens/QuestionScreen.js
import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import Question from '../components/Question';
import { Q } from '@nozbe/watermelondb'

function QuestionScreen({ navigation, route, questions }) {
  const database = useDatabase();
  const [question, setQuestion] = useState(null);
  const questionId = route?.params?.question_id || '';
  const { questionnaire, responseId, questionIndex } = route.params;
  const likertScales = questionnaire.likert_scales.filter((scale) =>
    question.likert_scale_ids.includes(scale.id)
  );

  useEffect(() => {
    if (!questionId) return;
    const collection = database.collections.get('questions');
    const subscription = collection.find(questionId)
      .then(setQuestion)
      .catch(() => {});
    return () => { subscription && subscription.unsubscribe?.() };
  }, [questionId]);

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

  if (!question) return <View><Text>No question found</Text></View>;
  return (
    <View>
      <Text>{question.text}</Text>
      <Question
        question={question}
        likertScales={likertScales}
        onSubmit={handleSubmit}
      />
    </View>
  );
}

export default QuestionScreen;
