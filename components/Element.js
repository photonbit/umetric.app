import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'

import Icon from './Icon'
import { Feather } from '@expo/vector-icons'

export default function Element({ element, onPress }) {
  function actionIcon() {
    if (element.action) {
      return <Feather name="external-link" style={styles.actionIcon} size={12} />
    }
  }
  return (
    <TouchableOpacity onPress={onPress} style={styles.element}>
      <View style={styles.icon}>
        <Icon icon={element.icon} />
      </View>
      {actionIcon()}
      <Text style={styles.text}>{element.name}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  element: {
    width: 170,
    padding: 10,
    alignItems: 'center',
  },
  icon: {
    height: 100,
    width: 100,
  },
  text: {
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actionIcon: {
    position: 'absolute',
    right: 20,
    top: 10,
  },
})
