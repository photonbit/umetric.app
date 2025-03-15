import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import i18n from 'i18n-js'

import ListCategoriesScreen from '../screens/ListCategoriesScreen'
import ListEventsScreen from '../screens/ListEventsScreen'
import {Header} from "./Header";

const BasicInputStack = createStackNavigator()

export function BasicInputFlow() {
  return (
    <BasicInputStack.Navigator
        screenOptions={{
        header: (props) => <Header {...props} />,
      }}
    >
      <BasicInputStack.Screen
        name="ListCategories"
        component={ListCategoriesScreen}
        options={{ title: 'uMetric' }}
      />
      <BasicInputStack.Screen
        name="ListEvents"
        component={ListEventsScreen}
        options={{ title: i18n.t('events') }}
      />
    </BasicInputStack.Navigator>
  )
}
