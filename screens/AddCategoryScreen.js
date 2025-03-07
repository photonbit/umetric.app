import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import i18n from 'i18n-js'

import IconSelector from '../components/IconSelector'
import Icon from '../components/Icon'
import * as RootNavigation from '../navigation/RootNavigation'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { baseStyles, commonStyles } from '../styles/common'
import {Q} from "@nozbe/watermelondb";

function AddCategoryScreen({ }) {
  const [modalVisible, setModalVisible] = useState(false)
  const [icon, setIcon] = useState('Apple')
  const [name, setName] = useState('')
  const database = useDatabase()

  const saveCategory = async () => {
    await database.write(async () => {
      const maxOrderCategory = await database
        .collections
        .get('categories')
        .query(
          Q.sortBy('order', 'desc'),
          Q.take(1)
        )
        .fetch()

      const newOrder = maxOrderCategory.length > 0 ? maxOrderCategory[0].order + 1 : 1

      await database.get('categories').create((category) => {
        category.name = name
        category.icon = icon
        category.active = true
        category.order = newOrder
      })
    })
    RootNavigation.navigate('ListEditCategories')
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
        <Text style={baseStyles.title}>{i18n.t('icon')}</Text>
      <TouchableOpacity
          style={{ ...commonStyles.icon }}
          onPress={() => { setModalVisible(true) }} >
        <Icon icon={icon} />
      </TouchableOpacity>

      <TouchableOpacity style={baseStyles.button} onPress={saveCategory} underlayColor='#99d9f4' disabled={name.length===0}>
              <Text style={baseStyles.buttonText}>{i18n.t('save')}</Text>
            </TouchableOpacity>
    </View>
  )
}

export default AddCategoryScreen;
