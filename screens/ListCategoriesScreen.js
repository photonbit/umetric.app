import React from 'react'
import { FlatList, StyleSheet } from 'react-native'

import * as RootNavigation from '../navigation/RootNavigation'
import Element from '../components/Element'

export default function ListCategoriesScreen () {
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
      name: 'Rumiaciones',
      icon: 'programation'
    },
    {
      id: '5',
      name: 'Emociones',
      icon: 'broken_heart'
    },
    {
      id: '6',
      name: 'Deportes',
      icon: 'tennis'
    }
  ]

  const onPress = () => RootNavigation.navigate('ListEvents')

  const renderItem = ({ item }) => (
    <Element
    element={item}
    onPress={onPress} />
  )
  return (
          <FlatList
          style={styles.flatlist}
          contentContainerStyle={{ alignItems: 'center' }}
      data={categorias}
      renderItem={renderItem}
      horizontal={false}
        numColumns={2}
      keyExtractor={item => item.id}
    />
  )
}

const styles = StyleSheet.create({
  flatlist: {
    paddingTop: 15,
    flex: 1
  }
})
