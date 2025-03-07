// screens/QuestionnaireScreen.js
import React, { useMemo } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import i18n from 'i18n-js';
import { withObservables } from '@nozbe/watermelondb/react';
import { mergeMap } from 'rxjs/operators';
import { withDatabase } from '@nozbe/watermelondb/react';

const QuestionnaireScreen = ({ navigation, questionnaireRaw, localizedQuestionnaire }) => {
  const getRandomQuestions = () => {
    const shuffledQuestions = [...questionnaireRaw.questions];
    shuffledQuestions.sort(() => 0.5 - Math.random());
    return shuffledQuestions.slice(0, 3);
  };

  const memoizedQuestions = useMemo(() => getRandomQuestions(), [questionnaireRaw.questions]);

  const startQuestionnaireResponse = () => {
    startQuestionnaire(questionnaireRaw.id).then(response => {
      navigation.navigate('Question', {
        questionnaire: questionnaireRaw,
        responseId: response.id,
        questionIndex: 0,
      });
    }).catch(error => {
      console.log(error);
    });
  };

  if (!localizedQuestionnaire) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{localizedQuestionnaire.name}</Text>
      <Text style={styles.description}>{localizedQuestionnaire.description}</Text>
      <Text style={styles.instructions}>{localizedQuestionnaire.instructions}</Text>
      <Text style={styles.sampleTitle}>Sample Questions:</Text>
      {memoizedQuestions.map((question, index) => (
        <Text key={index} style={styles.sampleQuestion}>{`${index + 1}. ${question.text}`}</Text>
      ))}
      <TouchableOpacity style={styles.button} onPress={startQuestionnaireResponse} underlayColor='#99d9f4'>
        <Text style={styles.buttonText}>{i18n.t('startQuestionnaire')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const enhance = withObservables(['route'], ({ route, database }) => {
  const questionnaireId = route.params.questionnaire_id;
  return {
    questionnaireRaw: database.collections.get('questionnaires').findAndObserve(questionnaireId),
    localizedQuestionnaire: database.collections.get('questionnaires')
      .findAndObserve(questionnaireId)
      .pipe(
        mergeMap(async (q) => q ? q.getLocalizedInstance() : null)
      ),
  };
});

export default withDatabase(enhance(QuestionnaireScreen));

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 10,
  },
  instructions: {
    marginTop: 10,
    fontStyle: 'italic',
  },
  sampleTitle: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  sampleQuestion: {
    marginTop: 5,
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 40,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
});
