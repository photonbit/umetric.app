import React, { useLayoutEffect } from 'react'
import { Alert, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import i18n from 'i18n-js'

import EditableElement from '../components/EditableElement'
import * as RootNavigation from '../navigation/RootNavigation'
import * as Linking from 'expo-linking'
import { Q } from '@nozbe/watermelondb'
import { withDatabase, withObservables } from '@nozbe/watermelondb/react'

function EditListEventsScreen({ navigation, route, events, database }) {
  const categoryId = route.params.category_id

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.actionIcon}
          onPress={() => RootNavigation.navigate('AddEvent', { category_id: categoryId })}
        >
          <Feather name="file-plus" size={30} color="black" />
        </TouchableOpacity>
      ),
    })
  }, [])

  const deleteEvent = async (eventId) => {
    await database.write(async () => {
      const ev = await database.get('events').find(eventId)
      await ev.markAsDeleted()
    })
  }

  const updateEventsOrder = async (updatedEvents) => {
    await database.write(async () => {
      for (const e of updatedEvents) {
        const ev = await database.get('events').find(e.id)
        await ev.update((item) => {
          item.order = e.order
        })
      }
    })
  }

  const onNamePress = (item) => Linking.openURL(item.action)
  const onEditPress = (item) => RootNavigation.navigate('EditEvent', { event_id: item.id })
  const onDeletePress = (item) =>
    Alert.alert(
      i18n.t('delete') + ' ' + item.name + '?',
      i18n.t('confirmDelete'),
      [
        {
          text: i18n.t('okNo'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: i18n.t('yes'), onPress: () => deleteEvent(item.id) },
      ],
      { cancelable: false },
    )

  const onUpPress = (item) => {
    const index = events.findIndex((e) => e.id === item.id)
    if (index > 0) {
      const oldPrev = events[index - 1]
      updateEventsOrder([
        { id: item.id, order: oldPrev.order },
        { id: oldPrev.id, order: item.order },
      ])
    }
  }

  const onDownPress = (item) => {
    const index = events.findIndex((e) => e.id === item.id)
    if (index < events.length - 1) {
      const oldNext = events[index + 1]
      updateEventsOrder([
        { id: item.id, order: oldNext.order },
        { id: oldNext.id, order: item.order },
      ])
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
      data={events}
      renderItem={renderItem}
      keyExtractor={(item) => '' + item.id}
    />
  )
}

const enhance = withObservables(['route'], ({ database, route }) => ({
  events: database.collections
    .get('events')
    .query(Q.where('category_id', route.params.category_id), Q.sortBy('order'))
    .observeWithColumns(['name', 'icon', 'active', 'order']),
}))

export default withDatabase(enhance(EditListEventsScreen))

const styles = StyleSheet.create({
  flatlist: {
    flex: 1,
  },
  actionIcon: {
    padding: 5,
    marginTop: 5,
    marginRight: 10,
  },
})
