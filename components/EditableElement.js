import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons'

import Icon from './Icon'

export default function EditableElement ({ element, onNamePress, onEditPress, onDeletePress, title }) {
  const text = title || element.name

  return (
    <View style={styles.element}>
      <TouchableOpacity style={styles.icon} onPress={onNamePress} >
        <Icon icon={element.icon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.title} onPress={onNamePress}>
        <Text numberOfLines={2} style={styles.text}>{text}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionIcon} onPress={onEditPress}>
        <Feather name="edit" size={30} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionIcon} onPress={onDeletePress}>
        <Feather name="trash-2" size={30} color="black" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  element: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'stretch',
    flexWrap: 'wrap',
    height: 80,
    padding: 10,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'white'
  },
  icon: {
    height: 40,
    width: 40
  },
  actionIcon: {
    padding: 5
  },
  title: {
    width: 180,
    height: 40,
    justifyContent: 'center',
    overflow: 'hidden'
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    overflow: 'hidden'
  }

})
