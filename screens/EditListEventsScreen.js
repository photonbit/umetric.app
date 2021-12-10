import React, { useLayoutEffect } from 'react'
import {Alert, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import { Feather } from '@expo/vector-icons'

import EditableElement from '../components/EditableElement'
import * as RootNavigation from '../navigation/RootNavigation'
import {useQuery} from "react-query";
import {getEvents} from "../services/UmetricAPI";

export default function EditListEventsScreen ({ navigation, route }) {
  const categoryId = route.params.category_id
  const { data, error, isError, isLoading } = useQuery(['events', categoryId], getEvents)

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

  if (isLoading) {
    return <View><Text>Loading...</Text></View>
  }
  if (isError) {
    return <View><Text>Something is wrong: {error.message}...</Text></View>
  }

  const onNamePress = (item) => RootNavigation.navigate('OpenAction', { item_id: item.id })
  const onEditPress = (item) => RootNavigation.navigate('EditEvent', { item_id: item.id })
  const onDeletePress = (item) => Alert.alert(
    'Borrar ' + item.name + '?',
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
      data={data}
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
