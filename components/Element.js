import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'

import Icon from './Icon'

export default function Element ({ element, onPress }) {
  return (
        <TouchableOpacity onPress={onPress} style={styles.element}>
        <View style={styles.icon}>
            <Icon icon={element.icon} />
        </View>
        <Text style={styles.text}>{element.name}</Text>
        </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  element: {
    height: 150,
    width: 170,
    padding: 10,
    alignItems: 'center'
  },
  icon: {
    height: 100,
    width: 100
  },
  text: {
    paddingTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  }

})
