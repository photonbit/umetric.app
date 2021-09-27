import React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import {useQuery} from 'react-query'
import * as Linking from 'expo-linking'

import Element from '../components/Element'

import { get_events } from '../services/UmetricAPI'


export default function ListCategoriesScreen ({route}) {
  const onPress = (item) => Linking.openURL(item.playlist)
  const category_id = route.params.category_id

  const { data, error, isError, isLoading } = useQuery(['events', category_id], get_events)

  if (isLoading) {
    return <View><Text>Loading...</Text></View>
  }
  if (isError) {
    return <View><Text>Something is wrong: {error.message}...</Text></View>
  }


  const renderItem = ({ item }) => (
    <Element
    element={item}
    onPress={() => onPress(item)} />
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
