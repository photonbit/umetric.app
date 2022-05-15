import React, {useEffect, useLayoutEffect, useState} from 'react'
import {ActivityIndicator, FlatList, StyleSheet, Text, View} from 'react-native'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import * as Linking from 'expo-linking'
import i18n from 'i18n-js'

import Element from '../components/Element'

import { getEvents, logEvent } from '../services/UmetricAPI'
import * as RootNavigation from "../navigation/RootNavigation";

export default function ListCategoriesScreen ({ navigation, route }) {
  const categoryId = route.params.category_id
  const [event, setEvent] = useState({
    id: '',
    action: '',
    name: '',
    icon: ''
  })
  const { data, error, isError, isLoading } = useQuery(['events', categoryId], getEvents)
  const mutation = useMutation((eventId) => logEvent({ eventId: eventId, duration: null }))
  const { isSuccess } = mutation
  const queryClient = useQueryClient()

  const onPress = (item) => {
    setEvent(item)
    mutation.mutate(item.id)
  }

  const renderItem = ({ item }) => (
    <Element
    element={item}
    onPress={() => onPress(item)} />
  )

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries('commitments').then(() => {
            if (event.action) {
              Linking.openURL(event.action)
            }

            RootNavigation.navigate('ListCategories')
          }
      )
    }
  }, [isSuccess])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.category_name
    })
  }, [])

  if (isLoading) {
    return <View><ActivityIndicator size="large" /></View>
  }
  if (isError) {
    return <View><Text>{i18n.t('somethingIsWrong')}: {error.message}...</Text></View>
  }

  return (
          <FlatList
          style={styles.flatlist}
          contentContainerStyle={{ alignItems: 'center' }}
      data={data.sort((a, b) => a.order - b.order)}
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
