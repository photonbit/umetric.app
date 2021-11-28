import React, { useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer'

import { createStackNavigator } from '@react-navigation/stack'

import LoginScreen from '../screens/LoginScreen'

import { BasicInputFlow } from './InputFlow'
import { EditFlow } from './EditFlow'
import { GoalsFlow } from './GoalsFlow'
import { RemindersFlow } from './RemindersFlow'
import { navigationRef } from './RootNavigation'

import { Context } from '../filters/Store'
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Drawer = createDrawerNavigator()
const Stack = createStackNavigator()

export default function CompleteFlow () {
  const [state, dispatch] = useContext(Context)

  function logout() {
      AsyncStorage.removeItem("remember_cookie").then(function() {
            axios.defaults.headers.common["cookie"] = null
            dispatch({ type: 'SET_LOGIN', payload: false })
      })
  }

  AsyncStorage.getItem("remember_cookie").then(function(data) {
    if (data != null) {
        axios.defaults.headers.common["cookie"] = data
        dispatch({ type: 'SET_LOGIN', payload: true })
    }
  })

  return (
    <NavigationContainer ref={navigationRef}>
    {state.login === false
      ? (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'uMetric' }} />
        </Stack.Navigator>
        )
      : (

      <Drawer.Navigator drawerContent={(props) => {
      return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem label="Logout" onPress={logout} />
        </DrawerContentScrollView>
      );
    }}>
        <Drawer.Screen name="Input" component={BasicInputFlow} options={{ title: 'Registrar' }} />
        <Drawer.Screen name="Edit" component={EditFlow} options={{ title: 'Editar' }} />
        <Drawer.Screen name="Metas" component={GoalsFlow} options={{ title: 'Metas' }} />
        <Drawer.Screen name="Recordatorios" component={RemindersFlow} options={{ title: 'Recordatorios' }} />
      </Drawer.Navigator>
        )}
    </NavigationContainer>
  )
}
