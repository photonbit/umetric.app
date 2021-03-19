import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

import IconSelector from '../components/IconSelector'
import Icon from '../components/Icon'
import * as RootNavigation from '../navigation/RootNavigation'

export default function AddCategoryScreen () {
  const onPress = () => RootNavigation.navigate('ListEditCategories')

  const [modalVisible, setModalVisible] = useState(false)
  const [icon, setIcon] = useState('mountain')
  const [name, setName] = useState('')

  return (
    <View style={styles.container}>
        <IconSelector
            visible={modalVisible}
            setVisible={setModalVisible}
            selected={icon}
            setIcon={setIcon}
        />

        <Text style={styles.title}>Nombre</Text>
        <TextInput onChangeText={setName} value={name} style={styles.input} />
        <Text style={styles.title}>Icono</Text>
      <TouchableOpacity
          style={styles.icon}
          onPress={() => {
            setModalVisible(true)
          }} >
        <Icon icon={icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onPress} underlayColor='#99d9f4'>
              <Text style={styles.buttonText}>Guardar</Text>
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
