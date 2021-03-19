import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import ShowGoalsScreen from '../screens/ShowGoalsScreen'
import PomodoroScreen from '../screens/PomodoroScreen'
import AddGoalScreen from '../screens/AddGoalScreen'
import EditGoalScreen from '../screens/EditGoalScreen'

const GoalsStack = createStackNavigator()

export function GoalsFlow () {
  return (
    <GoalsStack.Navigator>
      <GoalsStack.Screen name="ShowGoals" component={ShowGoalsScreen} options={{ title: 'Metas Semanales' }} />
      <GoalsStack.Screen name="Pomodoro" component={PomodoroScreen} options={{ title: 'Pomodoro' }} />
      <GoalsStack.Screen name="EditGoal" component={EditGoalScreen} options={{ title: 'Editar Meta' }} />
      <GoalsStack.Screen name="AddGoal" component={AddGoalScreen} options={{ title: 'Añadir Meta' }} />
    </GoalsStack.Navigator>
  )
}
