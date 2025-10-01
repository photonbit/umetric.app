import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import i18n from 'i18n-js'

import ConfigurationScreen from '../screens/ConfigurationScreen'
import { Header } from './Header'

const ConfigStack = createStackNavigator()

export function ConfigurationFlow() {
  return (
    <ConfigStack.Navigator
      screenOptions={{
        header: (props) => <Header {...props} />,
      }}
    >
      <ConfigStack.Screen
        name="ConfigurationScreen"
        component={ConfigurationScreen}
        options={{ title: i18n.t('configuration') }}
      />
    </ConfigStack.Navigator>
  )
} 