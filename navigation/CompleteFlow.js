import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'

import { BasicInputFlow } from './InputFlow'
import { EditFlow } from './EditFlow'
import { GoalsFlow } from './GoalsFlow'
import { RemindersFlow } from './RemindersFlow'
import { navigationRef } from './RootNavigation'

const Drawer = createDrawerNavigator()

export default function CompleteFlow () {
  return (
    <NavigationContainer ref={navigationRef}>
      <Drawer.Navigator>
        <Drawer.Screen name="Input" component={BasicInputFlow} options={{ title: 'Registrar' }} />
        <Drawer.Screen name="Edit" component={EditFlow} options={{ title: 'Editar' }} />
        <Drawer.Screen name="Metas" component={GoalsFlow} options={{ title: 'Metas' }} />
        <Drawer.Screen name="Recordatorios" component={RemindersFlow} options={{ title: 'Recordatorios' }} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}
