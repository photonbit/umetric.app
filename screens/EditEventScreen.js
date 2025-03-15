import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import i18n from 'i18n-js'

import IconSelector from '../components/IconSelector'
import Icon from '../components/Icon'
import * as RootNavigation from '../navigation/RootNavigation'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { withDatabase, withObservables } from '@nozbe/watermelondb/react'

function EditEventScreen({ event }) {
  const database = useDatabase()
  const [icon, setIcon] = useState(event.icon)
  const [name, setName] = useState(event.name)
  const [action, setAction] = useState(event.action)
  const [modalVisible, setModalVisible] = useState(false)

  const saveEvent = async () => {
    await database.write(async () => {
      await event.update((record) => {
        record.name = name
        record.icon = icon
        record.action = action
      })
    })
    RootNavigation.navigate('ListEditEvents', { category_id: event.category_id })
  }

  return (
    <View style={styles.container}>
      <IconSelector
        visible={modalVisible}
        setVisible={setModalVisible}
        selected={icon}
        setIcon={setIcon}
      />

      <Text style={styles.title}>{i18n.t('name')}</Text>
      <TextInput onChangeText={setName} defaultValue={name} style={styles.input} />
      <Text style={styles.title}>{i18n.t('actionOptional')}</Text>
      <TextInput onChangeText={setAction} defaultValue={action} style={styles.input} />
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
  event: database.collections.get('events').findAndObserve(route.params.event_id),
}))

export default withDatabase(enhance(EditEventScreen))

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
  }
})

