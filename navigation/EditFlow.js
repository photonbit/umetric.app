import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import i18n from 'i18n-js'

import EditListCategoriesScreen from '../screens/EditListCategoriesScreen'
import EditListEventsScreen from '../screens/EditListEventsScreen'
import EditCategoryScreen from '../screens/EditCategoryScreen'
import EditEventScreen from '../screens/EditEventScreen'
import AddCategoryScreen from '../screens/AddCategoryScreen'
import AddEventScreen from '../screens/AddEventScreen'

import { Header } from './Header'

const EditStack = createStackNavigator()

export function EditFlow() {
  return (
    <EditStack.Navigator
      screenOptions={{
        header: (props) => <Header {...props} />,
      }}
    >
      <EditStack.Screen
        name="ListEditCategories"
        component={EditListCategoriesScreen}
        options={{ title: i18n.t('editCategories') }}
      />
      <EditStack.Screen
        name="ListEditEvents"
        component={EditListEventsScreen}
        options={{ title: i18n.t('editEvents') }}
      />
      <EditStack.Screen
        name="EditCategory"
        component={EditCategoryScreen}
        options={{ title: i18n.t('editCategory') }}
      />
      <EditStack.Screen
        name="EditEvent"
        component={EditEventScreen}
        options={{ title: i18n.t('editEvent') }}
      />
      <EditStack.Screen
        name="AddCategory"
        component={AddCategoryScreen}
        options={{ title: i18n.t('addCategory') }}
      />
      <EditStack.Screen
        name="AddEvent"
        component={AddEventScreen}
        options={{ title: i18n.t('addEvent') }}
      />
    </EditStack.Navigator>
  )
}
