import React, { useLayoutEffect } from 'react'
import { Alert, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'

import EditableElement from '../components/EditableElement'
import * as RootNavigation from '../navigation/RootNavigation'

export default function EditListCategoriesScreen ({ navigation }) {
  const recordatorios = [
    {
      id: '1',
      question: 'Cómo te sientes ahora',
      days: '*',
      time: 'evening',
      category: {
        id: '2',
        name: 'Emociones',
        icon: 'love_and_romance'
      }
    },
    {
      id: '2',
      question: 'Dónde está Chuck Norris',
      days: '1,4,6',
      time: '19:00',
      category: {
        id: '3',
        name: 'Abdominales',
        icon: 'plank'
      }
    },
    {
      id: '3',
      question: 'Cómo te has sentido hoy',
      days: '*',
      time: '23:00',
      category: {
        id: '2',
        name: 'Emociones',
        icon: 'love_and_romance'
      }
    },
    {
      id: '4',
      question: 'Llama a personitas',
      days: '6',
      time: '18:00',
      category: {
        id: '4',
        name: 'Socializar',
        icon: 'connection'
      }
    }
  ]

  const onNamePress = () => RootNavigation.navigate('EditReminder')
  const onEditPress = () => RootNavigation.navigate('EditReminder')
  const onDeletePress = () => Alert.alert(
    'Borrar Recordatorio',
    'Que lo vas a borrar',
    [
      {
        text: 'Vale, no',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      },
      { text: 'Sí', onPress: () => console.log('OK Pressed') }
    ],
    { cancelable: false }
  )

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
            <TouchableOpacity style={styles.actionIcon} onPress={() => RootNavigation.navigate('AddReminder')}>
                <Feather name="plus" size={30} color="black" />
            </TouchableOpacity>
      )
    })
  }, [])

  const renderItem = ({ item }) => (
    <EditableElement
    element={item.category}
    onNamePress={onNamePress}
    onEditPress={onEditPress}
    title={item.question}
    onDeletePress={onDeletePress} />
  )
  return (
          <FlatList
      style={styles.flatlist}
      data={recordatorios}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  )
}

const styles = StyleSheet.create({
  flatlist: {
    flex: 1
  },
  actionIcon: {
    padding: 5,
    marginTop: 5,
    marginRight: 10
  }
})
