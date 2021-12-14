import React, { useLayoutEffect } from 'react'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'

import Goal from '../components/Goal'
import * as RootNavigation from '../navigation/RootNavigation'

export default function ShowGoalsScreen ({ navigation }) {
  const categorias = [
    {
      id: '1',
      name: 'Cuidados',
      icon: 'build/img/garden.svg',
      committed: 6,
      done: 2
    },
    {
      id: '2',
      name: 'Aprendizaje',
      icon: 'build/img/thinking.svg',
      committed: 5,
      done: 3
    },
    {
      id: '3',
      name: 'Empresa',
      icon: 'build/img/online.svg',
      committed: 2,
      done: 5
    },
    {
      id: '4',
      name: 'Deporte',
      icon: 'build/img/running.svg',
      committed: 7,
      done: 6
    },
    {
      id: '5',
      name: 'Meditación',
      icon: 'build/img/meditation.svg',
      committed: 3,
      done: 0
    }
  ]

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
            <TouchableOpacity style={styles.actionIcon} onPress={() => RootNavigation.navigate('AddGoal')}>
                <Feather name="plus" size={30} color="black" />
            </TouchableOpacity>
      )
    })
  }, [])

  const renderItem = ({ item }) => (
        <Goal
        category={item}
        committed={item.committed}
        done={item.done} />
  )

  return (
          <FlatList
          style={styles.flatlist}
          contentContainerStyle={{ alignItems: 'flex-end', justifyContent: 'space-between' }}
      data={categorias}
      renderItem={renderItem}
      horizontal={true}
      keyExtractor={item => item.id}
    />
  )
}

const styles = StyleSheet.create({
  flatlist: {
    paddingTop: 15,
    flex: 1,
    paddingBottom: 50
  },
  actionIcon: {
    padding: 5,
    marginTop: 5,
    marginRight: 10
  }
})
