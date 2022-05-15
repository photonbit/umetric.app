import React, { useLayoutEffect } from 'react'
import { useQuery } from 'react-query'
import { FlatList, StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import { Feather } from '@expo/vector-icons'
import i18n from 'i18n-js'

import Goal from '../components/Goal'
import * as RootNavigation from '../navigation/RootNavigation'
import { getCommitments } from '../services/UmetricAPI'

export default function ShowGoalsScreen ({ navigation }) {
  const { data, error, isError, isLoading } = useQuery('commitments', getCommitments)

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
        <Goal goal={item} />
  )

  if (isLoading) {
    return <View><Text>...</Text></View>
  }
  if (isError) {
    return <View><Text>{i18n.t('somethingIsWrong')}: {error.message}...</Text></View>
  }

  return (
          <FlatList
          style={styles.flatlist}
          contentContainerStyle={{ alignItems: 'flex-end', justifyContent: 'space-between' }}
      data={data}
      renderItem={renderItem}
      horizontal={true}
      keyExtractor={item => item.goal_id}
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
