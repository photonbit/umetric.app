import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'

import LoginScreen from '../screens/LoginScreen'

import { BasicInputFlow } from './InputFlow'
import { EditFlow } from './EditFlow'
import { GoalsFlow } from './GoalsFlow'
import { RemindersFlow } from './RemindersFlow'
import { navigationRef } from './RootNavigation'

const Drawer = createDrawerNavigator()
const Stack = createStackNavigator()

export default function CompleteFlow () {
  const userToken = undefined

  return (
    <NavigationContainer ref={navigationRef}>
    {userToken === undefined
      ? (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'uMetric' }} />
        </Stack.Navigator>
        )
      : (

      <Drawer.Navigator>
        <Drawer.Screen name="Input" component={BasicInputFlow} options={{ title: 'Registrar' }} />
        <Drawer.Screen name="Edit" component={EditFlow} options={{ title: 'Editar' }} />
        <Drawer.Screen name="Metas" component={GoalsFlow} options={{ title: 'Metas' }} />
        <Drawer.Screen name="Recordatorios" component={RemindersFlow} options={{ title: 'Recordatorios' }} />
      </Drawer.Navigator>
        )}
    </NavigationContainer>
  )
}
