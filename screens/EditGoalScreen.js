import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import i18n from 'i18n-js'
import { Feather } from '@expo/vector-icons'

import EventSelector from '../components/EventSelector'
import Element from '../components/Element'
import * as RootNavigation from '../navigation/RootNavigation'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { withDatabase, withObservables } from '@nozbe/watermelondb/react'

function EditGoalScreen({ goal, goalEvent, database }) {
  const [modalVisible, setModalVisible] = useState(false)
  const [number, setNumber] = useState(goal.number?.toString() || '')
  const [unit, setUnit] = useState(goal.kind === 'hours' ? 1 : 0)
  const [event, setEvent] = useState(goalEvent)

  const saveGoal = () => {
    const kind = unit === 1 ? 'hours' : 'times'
    database.write(async () => {
      await goal.update((g) => {
        g.number = Number(number)
        g.kind = kind
        g.event.set(event)
      })
    })
    RootNavigation.navigate('Metas', { screen: 'ShowGoals' })
  }

  const plusOne = () => {
    const newNumber = (Number(number) - 1).toString()
    setNumber(newNumber)
  }

  const minusOne = () => {
    const newNumber = (Number(number) + 1).toString()
    setNumber(newNumber)
  }

  return (
    <View style={styles.container}>
      <EventSelector
        visible={modalVisible}
        setVisible={setModalVisible}
        selected={event?.id}
        categoryId={event?.category_id}
        setEvent={setEvent}
      />
      <Text style={styles.header}>{i18n.t('wantToDedicate')}</Text>
      <View style={styles.numberSelection}>
        <TouchableOpacity onPress={plusOne} style={styles.numberButton}>
          <Feather name="minus-circle" size={40} color="black" />
        </TouchableOpacity>
        <TextInput
          onChangeText={setNumber}
          defaultValue={number}
          value={number}
          style={styles.numberInput}
          keyboardType="number-pad"
        />
        <TouchableOpacity onPress={minusOne} style={styles.numberButton}>
          <Feather name="plus-circle" size={40} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.kindSelection}>
        <SegmentedControl
          style={styles.kindInput}
          fontStyle={styles.kindInputText}
          values={[i18n.t('times'), i18n.t('hours')]}
          selectedIndex={unit}
          onChange={(event) => {
            setUnit(event.nativeEvent.selectedSegmentIndex)
          }}
        />
      </View>
      <View style={styles.categorySelection}>
        <Text style={styles.header}>{i18n.t('perWeekTo')}:</Text>
        <Element
          element={event}
          onPress={() => {
            setModalVisible(true)
          }}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={saveGoal} underlayColor="#99d9f4">
        <Text style={styles.text}>{i18n.t('save')}</Text>
      </TouchableOpacity>
    </View>
  )
}

const enhance = withObservables(['route'], ({ database, route }) => ({
  goal: database.collections.get('goals').findAndObserve(route.params.goal_id),
  goalEvent: database.collections.get('events').findAndObserve(route.params.event_id),
}))
export default withDatabase(enhance(EditGoalScreen))

const styles = StyleSheet.create({
  icon: {
    height: 90,
    width: 90,
    padding: 10
  },
  container: {
    flex: 1,
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
    marginTop: 25,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15
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
  },
  numberSelection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80
  },
  numberInput: {
    fontSize: 20,
    height: 50,
    width: 50,
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
  },
  numberButton: {
    padding: 15
  },
  kindSelection: {
    height: 70,
    marginTop: 15
  },
  kindInput: {
    height: 50
  },
  kindInputText: {
    fontSize: 18
  },
  categorySelection: {
    height: 180
  }
})
