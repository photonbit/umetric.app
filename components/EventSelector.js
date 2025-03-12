import React from 'react'
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import i18n from 'i18n-js'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { withDatabase, withObservables } from '@nozbe/watermelondb/react'

import Element from '../components/Element'

function EventSelector({ visible, setVisible, selected, setEvent, events }) {
  if (!visible) {
    return <View></View>
  }

  if (!events.length) {
    return (
      <View>
        <Text>{i18n.t('noEvents')}</Text>
      </View>
    )
  }

  const renderItem = ({ item }) => {
    const style = item.id === selected ? styles.selected : styles.icon
    return (
      <View style={style}>
        <Element
          element={item}
          onPress={() => {
            setEvent(item)
            setVisible(false)
          }}
        />
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
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{i18n.t('chooseActivity')}</Text>
          <FlatList
            style={styles.flatlist}
            data={events}
            renderItem={renderItem}
            horizontal={false}
            numColumns={2}
            keyExtractor={(item) => item.id}
          />

          <TouchableOpacity
            style={styles.button}
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

const enhance = withObservables(['categoryId'], ({ database, categoryId }) => ({
  events: database.collections
    .get('events')
    .query(Q.where('category_id', categoryId), Q.where('active', true), Q.sortBy('order'))
    .observeWithColumns(['name', 'icon', 'active', 'order']),
}))

export default withDatabase(enhance(EventSelector))

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
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
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    margin: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  icon: {},
})
