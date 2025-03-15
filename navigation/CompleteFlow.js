import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer'
import i18n from 'i18n-js'

import { BasicInputFlow } from './InputFlow'
import { EditFlow } from './EditFlow'
import { GoalsFlow } from './GoalsFlow'
// import { QuestionnaireFlow } from "./QuestionnaireFlow"
import { navigationRef } from './RootNavigation'

const Drawer = createDrawerNavigator()

export default function CompleteFlow() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Drawer.Navigator
        drawerContent={(props) => {
          return (
            <DrawerContentScrollView {...props}>
              <DrawerItemList {...props} />
            </DrawerContentScrollView>
          )
        }}
        screenOptions={{
            headerShown: false,
            swipeEdgeWidth: 300,
        }}
      >
        <Drawer.Screen
          name="Input"
          component={BasicInputFlow}
          options={{ title: i18n.t('register') }}
        />
        <Drawer.Screen name="Edit" component={EditFlow} options={{ title: i18n.t('edit') }} />
        <Drawer.Screen name="Metas" component={GoalsFlow} options={{ title: i18n.t('goals') }} />
        {/* Disable QuestionnaireFlow for the first version
        <Drawer.Screen name="Cuestionarios" component={QuestionnaireFlow} options={{ title: i18n.t('questionnaires') }} />
        */}
      </Drawer.Navigator>
    </NavigationContainer>
  )
}
