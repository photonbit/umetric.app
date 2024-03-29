import React from 'react'
import {ActivityIndicator, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import i18n from 'i18n-js'

import Icon from '../components/Icon'
import UmetricAPI from '../services/UmetricAPI'
import {useQuery} from "react-query";

export default function IconSelector ({ visible, setVisible, selected, setIcon }) {
    const { getIcons } = UmetricAPI()
    const { data, error, isError, isLoading } = useQuery('icons', getIcons)

  if (isLoading) {
    return <View><ActivityIndicator size="large" /></View>
  }
  if (isError) {
    return <View><Text>{i18n.t('somethingIsWrong')}: {error.message}...</Text></View>
  }

  const renderItem = ({ item }) => {
    const style = item === selected ? styles.selected : styles.icon
    return (
    <TouchableOpacity onPress={() => { setIcon("build/img/"+item); setVisible(false) }} >
    <View style={style}>
            <Icon icon={"build/img/"+item} />
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
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>{i18n.t('chooseIcon')}</Text>
                <FlatList
                    style={styles.flatlist}
                    data={data}
                    renderItem={renderItem}
                    horizontal={false}
                    numColumns={3}
                    keyExtractor={item => item}
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
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
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
    flex: 1,
    marginBottom: 10
  },
  icon: {
    height: 90,
    width: 90,
    padding: 10
  },
  selected: {
    borderRadius: 25,
    backgroundColor: '#99d9f4',
    height: 90,
    width: 90,
    padding: 10
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
})
