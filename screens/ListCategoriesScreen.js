import React, {useEffect, useState} from 'react'
import {useQuery} from 'react-query'
import { FlatList, Text, StyleSheet, View } from 'react-native'

import * as RootNavigation from '../navigation/RootNavigation'
import { get_categories } from '../services/UmetricAPI'
import Element from '../components/Element'

export default function ListCategoriesScreen () {
  const { data, error, isError, isLoading } = useQuery('categories', get_categories)

  if (isLoading) {
    return <View><Text>Loading...</Text></View>
  }
  if (isError) {
    return <View><Text>Something is wrong: {error.message}...</Text></View>
  }

  const go_to_events = (item) => RootNavigation.navigate('ListEvents', {category_id: item.id})

  const renderItem = ({ item }) => (
    <Element
    element={item}
    onPress={() => go_to_events(item)} />
  )

  return (
          <FlatList
          style={styles.flatlist}
          contentContainerStyle={{ alignItems: 'center' }}
      data={data}
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
