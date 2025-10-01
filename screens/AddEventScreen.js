import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import i18n from 'i18n-js'
import { Feather } from '@expo/vector-icons'

import IconSelector from '../components/IconSelector'
import CategorySelector from '../components/CategorySelector'
import Icon from '../components/Icon'
import * as RootNavigation from '../navigation/RootNavigation'
import { Q } from '@nozbe/watermelondb'
import {withDatabase, withObservables} from "@nozbe/watermelondb/react";

function AddEventScreen({ route, database, category }) {
  const categoryId = route.params.category_id
  const [modalVisible, setModalVisible] = useState(false)
  const [categoryModalVisible, setCategoryModalVisible] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [icon, setIcon] = useState('Tap01')
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

  const handleCategorySelected = (category) => {
    setSelectedCategory(category)
    const deepLink = `umetric://category/${category.id}`
    setAction(deepLink)
  }

  return (
    <View style={styles.container}>
      <IconSelector
        visible={modalVisible}
        setVisible={setModalVisible}
        selected={icon}
        setIcon={setIcon}
      />

      <CategorySelector
        visible={categoryModalVisible}
        setVisible={setCategoryModalVisible}
        selected={selectedCategory?.id}
        setCategory={handleCategorySelected}
      />

      <Text style={styles.title}>{i18n.t('name')}</Text>
      <TextInput onChangeText={setName} value={name} style={styles.input} />
      
      <Text style={styles.title}>{i18n.t('actionOptional')}</Text>
      <View style={styles.actionContainer}>
        <TextInput 
          onChangeText={setAction} 
          value={action} 
          style={styles.actionInput} 
          placeholder="https://... or umetric://..."
        />
        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => setCategoryModalVisible(true)}
        >
          <Feather name="folder" size={24} color="#48BBEC" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>{i18n.t('icon')}</Text>
      <TouchableOpacity
        style={styles.icon}
        onPress={() => {
          setModalVisible(true)
        }}
      >
        <Icon icon={icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={saveEvent} underlayColor="#99d9f4">
        <Text style={styles.buttonText}>{i18n.t('save')}</Text>
      </TouchableOpacity>
    </View>
  )
}

const enhance = withObservables(['route'], ({ database, route }) => ({
  category: database.collections.get('categories').findAndObserve(route.params.category_id),
}))

export default withDatabase(enhance(AddEventScreen))

const styles = StyleSheet.create({
  icon: {
    height: 90,
    width: 90,
    padding: 10
  },
  container: {
    justifyContent: 'center',
    padding: 20
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  input: {
    fontSize: 18,
    width: '100%',
    borderColor: '#CCCCCC',
    backgroundColor: '#FAFAFA',
    color: '#111111',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 10,
    marginTop: 5
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    marginTop: 5
  },
  actionInput: {
    fontSize: 18,
    flex: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#FAFAFA',
    color: '#111111',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5
  },
  categoryButton: {
    width: 48,
    height: 48,
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center'
  }
})