import React, { useLayoutEffect } from 'react'
import { Alert, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'

import EditableElement from '../components/EditableElement'
import * as RootNavigation from '../navigation/RootNavigation'

export default function EditListCategoriesScreen ({ navigation }) {
  const categorias = [
    {
      id: '1',
      name: 'Rutinas matutinas',
      icon: 'mountain'
    },
    {
      id: '2',
      name: 'Rutinas nocturnas',
      icon: 'bed'
    },
    {
      id: '3',
      name: 'Comportamientos evitativos',
      icon: 'bad_habits'
    },
    {
      id: '4',
      name: 'Deportes',
      icon: 'tennis'
    }
  ]

  const onNamePress = () => RootNavigation.navigate('ListEditEvents')
  const onEditPress = () => RootNavigation.navigate('EditCategory')
  const onDeletePress = () => Alert.alert(
    'Borrar Categoría',
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
            <TouchableOpacity style={styles.actionIcon} onPress={() => RootNavigation.navigate('AddCategory')}>
                <Feather name="folder-plus" size={30} color="black" />
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
      data={categorias}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  )
}

EditListCategoriesScreen.displayName = 'EditListCategoriesScreen'

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
