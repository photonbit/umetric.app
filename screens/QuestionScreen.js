// screens/QuestionScreen.js
import React, { useEffect, useState } from 'react'
import { Text, View, ActivityIndicator } from 'react-native'
import { withObservables, withDatabase } from '@nozbe/watermelondb/react'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import Question from '../components/Question'
import { Q } from '@nozbe/watermelondb'

function QuestionScreen({ navigation, route, questions }) {
  const database = useDatabase()
  const { questionnaireId, responseId, questionIndex } = route.params
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [likertScales, setLikertScales] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadQuestionData = async () => {
      if (!questions || questions.length === 0) {
        console.error('No questions available')
        setLoading(false)
        return
      }

      const question = questions[questionIndex]
      if (!question) {
        console.error('Question not found at index:', questionIndex)
        setLoading(false)
        return
      }

      setCurrentQuestion(question)

      // Load likert scales for this question
      try {
        const scales = await question.likertScales.fetch()
        setLikertScales(scales)
      } catch (error) {
        console.error('Error loading likert scales:', error)
        setLikertScales([])
      }

      setLoading(false)
    }

    loadQuestionData()
  }, [questions, questionIndex])

  const submitResponse = async (questionId, likertScaleId, value) => {
    try {
      await database.write(async () => {
        await database.collections.get('responses').create((r) => {
          r._raw.question_id = questionId
          r._raw.questionnaire_response_id = responseId
          r._raw.likert_scale_id = likertScaleId
          r.value = value
          r.date = Date.now()
        })
      })
    } catch (error) {
      console.error('Error submitting response:', error)
    }
  }

  const handleSubmit = async (questionId, responses) => {
    for (const key of Object.keys(responses)) {
      await submitResponse(questionId, key, responses[key])
    }
    
    if (questionIndex < questions.length - 1) {
      navigation.replace('Question', {
        questionnaireId,
        responseId,
        questionIndex: questionIndex + 1,
      })
    } else {
      navigation.goBack()
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (!currentQuestion) {
    return (
      <View>
        <Text>No question found</Text>
      </View>
    )
  }

  return (
    <View>
      <Question question={currentQuestion} likertScales={likertScales} onSubmit={handleSubmit} />
    </View>
  )
}

const enhance = withObservables(['route'], ({ route, database }) => {
  const questionnaireId = route?.params?.questionnaireId || ''
  return {
    questionnaireRaw: database.collections.get('questionnaires').findAndObserve(questionnaireId),
    questions: database.collections
      .get('questions')
      .query(Q.where('questionnaire_id', questionnaireId), Q.sortBy('order', 'asc'))
      .observe(),
  }
})

export default withDatabase(enhance(QuestionScreen))
