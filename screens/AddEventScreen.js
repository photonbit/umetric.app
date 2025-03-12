import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import i18n from 'i18n-js'

import IconSelector from '../components/IconSelector'
import Icon from '../components/Icon'
import * as RootNavigation from '../navigation/RootNavigation'
import { baseStyles, commonStyles } from '../styles/common'
import { Q } from '@nozbe/watermelondb'
import {withDatabase, withObservables} from "@nozbe/watermelondb/react";

function AddEventScreen({ route, database, category }) {
  const categoryId = route.params.category_id
  const [modalVisible, setModalVisible] = useState(false)
  const [icon, setIcon] = useState('Apple')
  const [name, setName] = useState('')
  const [action, setAction] = useState('')

  const saveEvent = async () => {
    await database.write(async () => {
      try {
        const maxOrderEvent = await database.collections
          .get('events')
          .query(Q.where('category_id', categoryId), Q.sortBy('order', 'desc'), Q.take(1))
          .fetch()

        const newOrder = maxOrderEvent.length > 0 ? maxOrderEvent[0].order + 1 : 1

        await database.get('events').create((ev) => {
          ev.name = name
          ev.icon = icon
          ev.action = action
          ev.active = true
          ev.order = newOrder
          ev.category.set(category)
        })
      } catch (error) {
        console.log(error)
      }
    })
    RootNavigation.navigate('ListEditEvents', { category_id: categoryId })
  }

  return (
    <View style={baseStyles.container}>
      <IconSelector
        visible={modalVisible}
        setVisible={setModalVisible}
        selected={icon}
        setIcon={setIcon}
      />

      <Text style={baseStyles.title}>{i18n.t('name')}</Text>
      <TextInput onChangeText={setName} value={name} style={baseStyles.input} />
      <Text style={baseStyles.title}>{i18n.t('actionOptional')}</Text>
      <TextInput onChangeText={setAction} value={action} style={baseStyles.input} />
      <Text style={baseStyles.title}>{i18n.t('icon')}</Text>
      <TouchableOpacity
        style={commonStyles.icon}
        onPress={() => {
          setModalVisible(true)
        }}
      >
        <Icon icon={icon} />
      </TouchableOpacity>

      <TouchableOpacity style={baseStyles.button} onPress={saveEvent} underlayColor="#99d9f4">
        <Text style={baseStyles.buttonText}>{i18n.t('save')}</Text>
      </TouchableOpacity>
    </View>
  )
}

const enhance = withObservables(['route'], ({ database, route }) => ({
  category: database.collections.get('categories').findAndObserve(route.params.category_id),
}))

export default withDatabase(enhance(AddEventScreen))
