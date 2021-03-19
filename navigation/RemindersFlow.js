import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import ListRemindersScreen from '../screens/ListRemindersScreen'
import EditReminderScreen from '../screens/EditReminderScreen'
import AddReminderScreen from '../screens/AddReminderScreen'

const RemindersStack = createStackNavigator()

export function RemindersFlow () {
  return (
    <RemindersStack.Navigator>
      <RemindersStack.Screen name="ListReminders" component={ListRemindersScreen} options={{ title: 'Editar Recordatorios' }} />
      <RemindersStack.Screen name="EditReminder" component={EditReminderScreen} options={{ title: 'Editar Recordatorio' }} />
      <RemindersStack.Screen name="AddReminder" component={AddReminderScreen} options={{ title: 'Añadir Recordatorio' }} />
    </RemindersStack.Navigator>
  )
}
