import React from 'react'
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import i18n from 'i18n-js'
import Icon from './Icon'
import icons from '../iconList'
import { baseStyles } from '../styles/common'

export default function IconSelector({ visible, setVisible, selected, setIcon }) {
  const renderItem = ({ item }) => {
    const style = item === selected ? styles.selected : styles.icon
    return (
      <TouchableOpacity
        onPress={() => {
          setIcon(item)
          setVisible(false)
        }}
      >
        <View style={style}>
          <Icon icon={item} />
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setVisible(!visible)
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{i18n.t('chooseIcon')}</Text>
          <FlatList
            style={styles.flatlist}
            data={icons}
            renderItem={renderItem}
            horizontal={false}
            numColumns={3}
            keyExtractor={(item) => item}
          />

          <TouchableOpacity
            style={baseStyles.button}
            underlayColor="#99d9f4"
            onPress={() => {
              setVisible(!visible)
            }}
          >
            <Text style={styles.textStyle}>{i18n.t('keepPrevious')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  flatlist: {
    flex: 1,
    marginBottom: 10,
  },
  icon: {
    height: 90,
    width: 90,
    padding: 10,
  },
  selected: {
    borderRadius: 25,
    backgroundColor: '#99d9f4',
    height: 90,
    width: 90,
    padding: 10,
  },
})
