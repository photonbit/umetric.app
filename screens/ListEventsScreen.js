import React, {useLayoutEffect} from 'react'
import {FlatList, StyleSheet, Text, View} from 'react-native'
import * as Linking from 'expo-linking'
import i18n from 'i18n-js'
import { Q } from '@nozbe/watermelondb'

import Element from '../components/Element'
import * as RootNavigation from "../navigation/RootNavigation";
import {Feather} from "@expo/vector-icons";
import {withDatabase, withObservables} from "@nozbe/watermelondb/react";
import EventLog from '../model/EventLog'

function ListEventsScreen ({ navigation, route, events, database }) {

  const onPress = async (item) => {
    EventLog.logEvent(database, item.id)
    if (item.action) {
      Linking.openURL(item.action)
    }
    RootNavigation.navigate('ListCategories')
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
  }, [navigation, route.params.category_name])

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

const enhance = withObservables(['route'], ({ database, route }) => ({
  events: database
      .collections
      .get('events')
      .query(
          Q.where('category_id', route.params.category_id),
          Q.where('active', true),
          Q.sortBy('order')
      )
      .observeWithColumns(['name', 'icon', 'active', 'order'])
}))

export default withDatabase(enhance(ListEventsScreen))

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
