// screens/QuestionnaireScreen.js
import React, { useMemo } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import i18n from 'i18n-js'
import { withObservables } from '@nozbe/watermelondb/react'
import { mergeMap } from 'rxjs/operators'
import { withDatabase } from '@nozbe/watermelondb/react'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { getCurrentUser } from '../utils/userUtils'

const QuestionnaireScreen = ({ navigation, questionnaireRaw, localizedQuestionnaire }) => {
  const database = useDatabase()

  const getRandomQuestions = async () => {
    if (!questionnaireRaw) return []
    
    try {
      const questions = await questionnaireRaw.questions.fetch()
      const shuffledQuestions = [...questions]
      shuffledQuestions.sort(() => 0.5 - Math.random())
      return shuffledQuestions.slice(0, 3)
    } catch (error) {
      console.error('Error fetching questions:', error)
      return []
    }
  }

  const [memoizedQuestions, setMemoizedQuestions] = React.useState([])

  React.useEffect(() => {
    if (questionnaireRaw) {
      getRandomQuestions().then(setMemoizedQuestions)
    }
  }, [questionnaireRaw])

  const startQuestionnaireResponse = async () => {
    try {
      const user = await getCurrentUser(database)
      if (!user) {
        console.error('No user available')
        return
      }

      const response = await database.write(async () => {
        return await database.collections.get('questionnaire_responses').create((qr) => {
          qr._raw.questionnaire_id = questionnaireRaw.id
          qr._raw.user_id = user.id
          qr.dateAnswered = new Date()
          qr.language = i18n.locale
        })
      })

      navigation.navigate('Question', {
        questionnaireId: questionnaireRaw.id,
        responseId: response.id,
        questionIndex: 0,
      })
    } catch (error) {
      console.error('Error starting questionnaire:', error)
    }
  }

  if (!localizedQuestionnaire) {
    return null
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{localizedQuestionnaire.name}</Text>
      <Text style={styles.description}>{localizedQuestionnaire.description}</Text>
      <Text style={styles.instructions}>{localizedQuestionnaire.instructions}</Text>
      <Text style={styles.sampleTitle}>Sample Questions:</Text>
      {memoizedQuestions.length > 0 ? (
        memoizedQuestions.map((question, index) => (
          <Text key={question.id || index} style={styles.sampleQuestion}>{`${index + 1}. ${question.text}`}</Text>
        ))
      ) : (
        <Text style={styles.sampleQuestion}>No questions available</Text>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={startQuestionnaireResponse}
        underlayColor="#99d9f4"
      >
        <Text style={styles.buttonText}>{i18n.t('startQuestionnaire')}</Text>
      </TouchableOpacity>
    </View>
  )
}

const enhance = withObservables(['route'], ({ route, database }) => {
  const questionnaireId = route.params.questionnaire_id
  return {
    questionnaireRaw: database.collections.get('questionnaires').findAndObserve(questionnaireId),
    localizedQuestionnaire: database.collections
      .get('questionnaires')
      .findAndObserve(questionnaireId)
      .pipe(
        mergeMap(async (q) => {
          if (!q) return null
          return await q.getLocalizedInstance()
        })
      ),
  }
})

export default withDatabase(enhance(QuestionnaireScreen))

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
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  },
})
