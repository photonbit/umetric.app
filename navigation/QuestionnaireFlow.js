import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import i18n from 'i18n-js'

import QuestionScreen from '../screens/QuestionScreen'
import QuestionnaireScreen from '../screens/QuestionnaireScreen'
import ListQuestionnairesScreen from '../screens/ListQuestionnairesScreen'
import {Header} from "./Header";

const QuestionnaireStack = createStackNavigator()

export function QuestionnaireFlow() {
  return (
    <QuestionnaireStack.Navigator
        screenOptions={{
        header: (props) => <Header {...props} />,
      }}
    >
      <QuestionnaireStack.Screen
        name="ListQuestionnaires"
        component={ListQuestionnairesScreen}
        options={{ title: i18n.t('questionnaires') }}
      />
      <QuestionnaireStack.Screen
        name="Questionnaire"
        component={QuestionnaireScreen}
        options={{ title: i18n.t('questionnaire') }}
      />
      <QuestionnaireStack.Screen
        name="Question"
        component={QuestionScreen}
        options={{ title: i18n.t('question') }}
      />
    </QuestionnaireStack.Navigator>
  )
}
