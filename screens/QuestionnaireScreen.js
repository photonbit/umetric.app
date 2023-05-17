// screens/QuestionnaireScreen.js
import React from 'react';
import {Button, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import i18n from 'i18n-js';

import { QuestionnaireService } from '../services/UmetricAPI';

export default function QuestionnaireScreen({ navigation, route }) {
  const questionnaireId = route.params.questionnaire_id
  const [questionnaire, setQuestionnaire] = React.useState(null);

  React.useEffect(() => {
    const fetchQuestionnaire = async () => {
      const data = await QuestionnaireService.getQuestionnaire(questionnaireId);
      setQuestionnaire(data);
    };

    fetchQuestionnaire();
  }, []);

  if (!questionnaire) {
    return null;
  }

  const getRandomQuestions = () => {
    const questions = [...questionnaire.questions];
    questions.sort(() => 0.5 - Math.random());
    return questions.slice(0, 3);
  }

  const startQuestionnaire = () => {
       navigation.navigate('Question', {
            questionnaire,
            questionIndex: 0,
          })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{questionnaire.name}</Text>
      <Text style={styles.description}>{questionnaire.description}</Text>
      <Text style={styles.instructions}>{questionnaire.instructions}</Text>
      <Text style={styles.sampleTitle}>Sample Questions:</Text>
      {getRandomQuestions().map((question, index) => (
        <Text key={index} style={styles.sampleQuestion}>{`${index + 1}. ${question.text}`}</Text>
      ))}
        <TouchableOpacity style={styles.button} onPress={startQuestionnaire} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>{ i18n.t('startQuestionnaire') }</Text>
      </TouchableOpacity>
    </View>
  );
}

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
