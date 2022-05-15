import React, {useEffect, useLayoutEffect} from 'react'
import {ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import { Feather } from '@expo/vector-icons'
import i18n from 'i18n-js'

import EditableElement from '../components/EditableElement'
import * as RootNavigation from '../navigation/RootNavigation'
import {useMutation, useQuery, useQueryClient} from "react-query";
import {deleteEvent, getEvents, updateEvents} from "../services/UmetricAPI";
import * as Linking from "expo-linking";

export default function EditListEventsScreen ({ navigation, route }) {
  const categoryId = route.params.category_id
  const { data, error, isError, isLoading } = useQuery(['events', categoryId], getEvents)

  const deleteMutation = useMutation(
    (eventId) => deleteEvent({ eventId }))
  const orderMutation = useMutation(
      (events) => updateEvents({events})
  )
  const isDeleteSuccess = deleteMutation.isSuccess
  const isOrderSuccess = orderMutation.isSuccess
  const queryClient = useQueryClient()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
            <TouchableOpacity style={styles.actionIcon} onPress={() =>
              RootNavigation.navigate('AddEvent', { category_id: categoryId })}>
                <Feather name="file-plus" size={30} color="black" />
            </TouchableOpacity>
      )
    })
  }, [])

  useEffect(() => {
    if (isDeleteSuccess || isOrderSuccess) {
      queryClient.invalidateQueries('events', categoryId).then(() =>
        RootNavigation.navigate('ListEditEvents', { category_id: categoryId })
      )
    }
  }, [isDeleteSuccess, isOrderSuccess])

  if (isLoading) {
    return <View><ActivityIndicator size="large" /></View>
  }
  if (isError) {
    return <View><Text>{i18n.t('somethingIsWrong')}: {error.message}...</Text></View>
  }

  const onNamePress = (item) => Linking.openURL(item.action)
  const onEditPress = (item) => RootNavigation.navigate('EditEvent', { event_id: item.id, category_id: categoryId })
  const onDeletePress = (item) => Alert.alert(
    i18n.t('delete') + ' ' + item.name + '?',
    i18n.t('confirmDelete'),
    [
      {
        text: i18n.t('okNo'),
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      },
      { text: i18n.t('yes'), onPress: () => deleteMutation.mutate(item.id) }
    ],
    { cancelable: false }
  )

  const onUpPress = (item) => {
    const index = data.findIndex(e => e.id === item.id)
    if (index > 0) {
      const oldPrev = data[index - 1]
      const itemOrder = { "id": item.id, "order": oldPrev.order}
      const oldPrevOrder = { "id": oldPrev.id, "order": item.order}

      orderMutation.mutate([itemOrder, oldPrevOrder])
    }
  }

  const onDownPress = (item) => {
    const index = data.findIndex(e => e.id === item.id)
    if (index < data.length - 1) {
      const oldNext = data[index + 1]
      const itemOrder = { "id": item.id, "order": oldNext.order}
      const oldNextOrder = { "id": oldNext.id, "order": item.order}

      orderMutation.mutate([itemOrder, oldNextOrder])
    }
  }

  const renderItem = ({ item }) => (
    <EditableElement
    element={item}
    onNamePress={() => onNamePress(item)}
    onEditPress={() => onEditPress(item)}
    onDeletePress={() => onDeletePress(item)}
    onDownPress={() => onDownPress(item)}
    onUpPress={() => onUpPress(item)}
    />
  )
  return (
          <FlatList
      style={styles.flatlist}
      data={data.sort((a, b) => a.order - b.order)}
      renderItem={renderItem}
      keyExtractor={item => "" + item.id}
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
