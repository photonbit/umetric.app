import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import i18n from 'i18n-js'

import ShowGoalsScreen from '../screens/ShowGoalsScreen'
import PomodoroScreen from '../screens/PomodoroScreen'
import AddGoalScreen from '../screens/AddGoalScreen'
import EditGoalScreen from '../screens/EditGoalScreen'

const GoalsStack = createStackNavigator()

export function GoalsFlow() {
  return (
    <GoalsStack.Navigator>
      <GoalsStack.Screen
        name="ShowGoals"
        component={ShowGoalsScreen}
        options={{ title: i18n.t('weeklyGoals') }}
      />
      <GoalsStack.Screen
        name="Pomodoro"
        component={PomodoroScreen}
        options={{ title: i18n.t('pomodoro') }}
      />
      <GoalsStack.Screen
        name="EditGoal"
        component={EditGoalScreen}
        options={{ title: i18n.t('editGoal') }}
      />
      <GoalsStack.Screen
        name="AddGoal"
        component={AddGoalScreen}
        options={{ title: i18n.t('addGoal') }}
      />
    </GoalsStack.Navigator>
  )
}
