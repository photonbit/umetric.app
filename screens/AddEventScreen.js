import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import i18n from 'i18n-js'


import IconSelector from '../components/IconSelector'
import Icon from '../components/Icon'
import * as RootNavigation from '../navigation/RootNavigation'
import {useMutation, useQueryClient} from "react-query";
import UmetricAPI from "../services/UmetricAPI";

export default function AddEventScreen ({ route }) {
  const categoryId = route.params.category_id
  const [modalVisible, setModalVisible] = useState(false)
  const [icon, setIcon] = useState('build/img/apple.svg')
  const [name, setName] = useState('')
  const [action, setAction] = useState('')
  const { addEvent } = UmetricAPI()
  const mutation = useMutation((newEvent) => addEvent({ categoryId, newEvent}))
  const queryClient = useQueryClient()
  const { isSuccess } = mutation

  const saveEvent = () => {
    mutation.mutate({
      name: name,
      icon: icon,
      action: action
    })
  }

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries('events', categoryId).then(()=>
        RootNavigation.navigate('ListEditEvents', { category_id: categoryId })
      )
    }
   }, [isSuccess]);

  return (
    <View style={styles.container}>
        <IconSelector
            visible={modalVisible}
            setVisible={setModalVisible}
            selected={icon}
            setIcon={setIcon}
        />

        <Text style={styles.title}>{i18n.t('name')}</Text>
        <TextInput onChangeText={setName} value={name} style={styles.input} />
        <Text style={styles.title}>{i18n.t('actionOptional')}</Text>
        <TextInput onChangeText={setAction} value={action} style={styles.input} />
        <Text style={styles.title}>{i18n.t('icon')}</Text>
      <TouchableOpacity
          style={styles.icon}
          onPress={() => {
            setModalVisible(true)
          }} >
        <Icon icon={icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={saveEvent} underlayColor='#99d9f4'>
              <Text style={styles.buttonText}>{i18n.t('save')}</Text>
            </TouchableOpacity>
    </View>
  )
}

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
