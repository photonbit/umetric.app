// screens/QuestionScreen.js
import React from 'react';
import Question from '../components/Question';
import UmetricAPI from '../services/UmetricAPI';

export default function QuestionScreen({ navigation, route }) {
  const { questionnaire, questionIndex } = route.params;
  const question = questionnaire.questions[questionIndex];
  const likertScales = questionnaire.likert_scales.filter((scale) =>
    question.likert_scale_ids.includes(scale.id)
  );
  const { submitResponse } = UmetricAPI();

  const handleSubmit = async (questionId, responses) => {
    await submitResponse(questionnaire.id, questionId, responses);
    if (questionIndex < questionnaire.questions.length - 1) {
      navigation.replace('Question', {
        questionnaire,
        questionIndex: questionIndex + 1,
      });
    } else {
      navigation.goBack();
    }
  };

  return (
    <Question
      question={question}
      likertScales={likertScales}
      onSubmit={handleSubmit}
    />
  );
}
