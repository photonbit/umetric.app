import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import i18n from 'i18n-js'

import ListCategoriesScreen from '../screens/ListCategoriesScreen'
import ListEventsScreen from '../screens/ListEventsScreen'

const BasicInputStack = createStackNavigator()

export function BasicInputFlow () {
  return (
    <BasicInputStack.Navigator>
      <BasicInputStack.Screen name="ListCategories" component={ListCategoriesScreen} options={{ title: 'uMetric' }} />
      <BasicInputStack.Screen name="ListEvents" component={ListEventsScreen} options={{ title: 'Eventos' }} />
    </BasicInputStack.Navigator>
  )
}
