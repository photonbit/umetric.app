import React, { useLayoutEffect } from 'react'
import { Alert, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'

import EditableElement from '../components/EditableElement'
import * as RootNavigation from '../navigation/RootNavigation'

export default function EditListEventsScreen ({ navigation }) {
  const eventos = []

  const onNamePress = () => RootNavigation.navigate('OpenAction')
  const onEditPress = () => RootNavigation.navigate('EditEvent')
  const onDeletePress = () => Alert.alert(
    'Borrar Evento',
    'Que la vas a borrar',
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
            <TouchableOpacity style={styles.actionIcon} onPress={() => RootNavigation.navigate('AddEvent')}>
                <Feather name="file-plus" size={30} color="black" />
            </TouchableOpacity>
      )
    })
  }, [])

  const renderItem = ({ item }) => (
    <EditableElement
    element={item}
    onNamePress={onNamePress}
    onEditPress={onEditPress}
    onDeletePress={onDeletePress} />
  )
  return (
          <FlatList
      style={styles.flatlist}
      data={eventos}
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
