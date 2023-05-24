import React, { useContext, useState } from 'react'
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native'
import i18n from 'i18n-js'
import Toast from 'react-native-toast-message'


import { login } from '../services/UmetricAPI'
import { Context } from '../filters/Store'

export default function LoginScreen () {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [, dispatch] = useContext(Context)

  function errorLogin (error) {
    dispatch({ type: 'SET_LOGIN', payload: false })
    console.error(error)
    Toast.show({
      type: 'error',
      text1: i18n.t('loginFailed'),
      text2: error.message
    })
  }

  function successLogin () {
    dispatch({ type: 'SET_LOGIN', payload: true })
  }

  async function doLogin () {
    try {
      await login(user, password)
      successLogin()
    } catch (error) {
      errorLogin(error)
    }
  }

  return (
    <View style={styles.container}>
        <View style={styles.headerContainer}>
            <Image style={styles.logo} source={require('../assets/logo.png')} resizeMode='contain' />
        </View>
        <View style={styles.formContainer}>
            <TextInput
                style={styles.inputText}
                value={user}
                onChangeText={setUser}
                textContentType={'username'}
                placeholder={i18n.t('username')}
                placeholderTextColor="#003f5c" />

                <TextInput
                style={styles.inputText}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                textContentType={'password'}
                placeholder={i18n.t('password')}
                placeholderTextColor="#003f5c" />
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={doLogin}>
                <Text style={styles.buttonText}>{i18n.t('login')}</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'white'
  },
  headerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  logo: {
    width: '80%'
  },
  logoBonos: {
    width: '34%',
    marginLeft: 15,
    height: 100
  },
  title: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#990505',
    marginLeft: 10
  },
  formContainer: {
    width: '80%'

  },
  inputText: {
    fontSize: 18,
    width: '100%',
    height: 50,
    borderColor: '#CCCCCC',
    backgroundColor: '#FAFAFA',
    color: '#111111',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 25,
    marginTop: 15
  },
  buttonContainer: {
    alignItems: 'center'
  },
  button: {
    alignItems: 'center',
    width: 200,
    backgroundColor: '#48BBEC',
    borderRadius: 15,
    padding: 15,
    justifyContent: 'space-evenly'
  },
  buttonText: {
    color: 'white',
    fontSize: 24
  }
})
