import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { useMutation, useQuery } from 'react-query'
import * as Linking from 'expo-linking'

import Element from '../components/Element'

import { getEvents, logEvent } from '../services/UmetricAPI'
import * as RootNavigation from "../navigation/RootNavigation";

export default function ListCategoriesScreen ({ route }) {
  const categoryId = route.params.category_id
  const [event, setEvent] = useState({
    id: '',
    action: '',
    name: '',
    icon: ''
  })
  const { data, error, isError, isLoading } = useQuery(['events', categoryId], getEvents)
  const mutation = useMutation((eventId) => logEvent({ eventId: event.id }))
  const { isSuccess } = mutation

  const onPress = (item) => {
    setEvent(item)
    mutation.mutate(event.id)
  }

  const renderItem = ({ item }) => (
    <Element
    element={item}
    onPress={() => onPress(item)} />
  )

  useEffect(() => {
    if (isSuccess) {
      if (event.action) {
        Linking.openURL(event.action)
      }

      RootNavigation.navigate('ListCategories')
    }
  }, [isSuccess])

  if (isLoading) {
    return <View><Text>Loading...</Text></View>
  }
  if (isError) {
    return <View><Text>Something is wrong: {error.message}...</Text></View>
  }

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
