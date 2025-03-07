import React, { useEffect, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import i18n from 'i18n-js'
import { Feather } from '@expo/vector-icons'

import EventSelector from '../components/EventSelector'
import Element from '../components/Element'
import * as RootNavigation from '../navigation/RootNavigation'
import { baseStyles, commonStyles } from '../styles/common'
import SegmentedControl from "@react-native-segmented-control/segmented-control";

function EditGoalScreen({ goal }) {
  const goalId = route.params.goal_id
  const [modalVisible, setModalVisible] = useState(false)
  const [number, setNumber] = useState('')
  const [unit, setUnit] = useState(0)
  const [event, setEvent] = useState({
    id: '',
    name: '',
    icon: ''
  })

  // Placeholder for loading goal data
  useEffect(() => {
    // Replace with Watermelon queries or other data fetching logic
    setNumber('5')
    setUnit(0)
    setEvent({
      id: '1',
      name: 'Sample Event',
      icon: 'icon-name'
    })
  }, [])

  const saveGoal = () => {
    let kind;
    if (unit === 0) {
      kind = 'times'
    } else {
      kind = 'hours'
    }
    // Placeholder for saving goal data
    console.log({
      number: number,
      kind: kind,
      event_id: event.id
    })
  }

  const plusOne = () => {
    const newNumber = (Number(number) - 1).toString()
    setNumber(newNumber)
  }

  const minusOne = () => {
    const newNumber = (Number(number) + 1).toString()
    setNumber(newNumber)
  }

  useEffect(() => {
    // Placeholder for success handling
    console.log('Goal saved successfully')
  }, [])

  return (
    <View style={baseStyles.container}>
      <EventSelector
        visible={modalVisible}
        setVisible={setModalVisible}
        selected={event.id}
        categoryId={event.category_id}
        setEvent={setEvent}
      />
      <Text style={baseStyles.header}>{i18n.t('wantToDedicate')}</Text>
      <View style={commonStyles.numberSelection}>
        <TouchableOpacity
          onPress={plusOne}
          style={commonStyles.numberButton}
        >
          <Feather name="minus-circle" size={40} color="black" />
        </TouchableOpacity>
        <TextInput
          onChangeText={setNumber}
          defaultValue={number}
          value={number}
          style={commonStyles.numberInput}
          keyboardType="number-pad"
        />
        <TouchableOpacity
          onPress={minusOne}
          style={commonStyles.numberButton}
        >
          <Feather name="plus-circle" size={40} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.kindSelection}>
        <SegmentedControl
          style={commonStyles.kindInput}
          fontStyle={commonStyles.kindInputText}
          values={[i18n.t('times'), i18n.t('hours')]}
          selectedIndex={unit}
          onChange={(event) => {
            setUnit(event.nativeEvent.selectedSegmentIndex)
          }}
        />
      </View>
      <View style={commonStyles.categorySelection}>
        <Text style={baseStyles.header}>{i18n.t('perWeekTo')}:</Text>
        <Element
          element={event}
          onPress={() => { setModalVisible(true) }} />
      </View>
      <TouchableOpacity style={styles.button} onPress={saveGoal} underlayColor='#99d9f4'>
        <Text style={baseStyles.text}>{i18n.t('save')}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default EditGoalScreen;
