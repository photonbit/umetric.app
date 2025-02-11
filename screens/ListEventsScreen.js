import React, {useEffect, useLayoutEffect, useState} from 'react'
import {ActivityIndicator, FlatList, StyleSheet, Text, View} from 'react-native'
import * as Linking from 'expo-linking'
import i18n from 'i18n-js'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/hooks'

import Element from '../components/Element'
import * as RootNavigation from "../navigation/RootNavigation";
import {Feather} from "@expo/vector-icons";

export default function ListCategoriesScreen ({ navigation, route }) {
  const categoryId = route.params.category_id
  const [event, setEvent] = useState({
    id: '',
    action: '',
    name: '',
    icon: ''
  })
  const database = useDatabase()
  const [events, setEvents] = useState([])

  useEffect(() => {
    const collection = database.collections.get('events')
    const subscription = collection
      .query(
        Q.where('category_id', categoryId),
        Q.sortBy('order', Q.asc)
      )
      .observe()
      .subscribe(setEvents)
    return () => subscription.unsubscribe()
  }, [])

  const onPress = (item) => {
    setEvent(item)
  }

  const renderItem = ({ item }) => (
    <Element
    element={item}
    onPress={() => onPress(item)} />
  )

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.category_name
    })
  }, [])

  if (!events.length) {
    return (
        <View style={styles.help}>
          <Feather name='arrow-right' size={60} style={styles.swipe}/>
          <Text style={styles.helpText}>{i18n.t('noEvents')}</Text>
        </View>
    )
  }

  return (
          <FlatList
          style={styles.flatlist}
          contentContainerStyle={{ alignItems: 'center' }}
      data={events}
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
  },
  help: {
    flex: 1,
  },
  swipe: {
    marginTop: '20%',
    paddingLeft: 15
  },
  helpText: {
    padding: 20,
    fontSize: 20,
    color: '#000',
    marginTop: '5%',
  }
})
