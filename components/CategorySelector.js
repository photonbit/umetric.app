import React from 'react'
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import i18n from 'i18n-js'

import Element from '../components/Element'
import {useQuery} from "react-query";
import {getCategories} from "../services/UmetricAPI";

export default function CategorySelector ({ visible, setVisible, selected, setCategory }) {
  const { data, error, isError, isLoading } = useQuery('categories', getCategories)

  if (isLoading) {
    return <View><Text>...</Text></View>
  }
  if (isError) {
    return <View><Text>{i18n.t('somethingIsWrong')}: {error.message}...</Text></View>
  }

  const renderItem = ({ item }) => {
    const style = item.id === selected ? styles.selected : styles.icon
    return (
            <View style={style}>
                <Element
                element={item}
                onPress={() => { setCategory(item); setVisible(false) }} />
            </View>
    )
  }

  return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
              setVisible(!visible)
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>{i18n.t('chooseCategory')}</Text>
                <FlatList
                    style={styles.flatlist}
                    data={data}
                    renderItem={renderItem}
                    horizontal={false}
                    numColumns={2}
                    keyExtractor={item => item.id}
                />

                <TouchableOpacity
                  style={styles.button}
                  underlayColor='#99d9f4'
                  onPress={() => {
                    setVisible(!visible)
                  }}>
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
    marginTop: 22
  },
  modalView: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalText: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  flatlist: {
    flex: 1
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    margin: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  icon: {

  }
})
