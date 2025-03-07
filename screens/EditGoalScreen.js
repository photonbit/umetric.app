import React, { useState, useEffect } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import i18n from 'i18n-js'
import { Feather } from '@expo/vector-icons'

import EventSelector from '../components/EventSelector'
import Element from '../components/Element'
import * as RootNavigation from '../navigation/RootNavigation'
import { baseStyles, commonStyles } from '../styles/common'
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { withDatabase, withObservables } from '@nozbe/watermelondb/react'

function EditGoalScreen({ goal, database }) {
  const [modalVisible, setModalVisible] = useState(false)
  const [number, setNumber] = useState(goal.number?.toString() || '')
  const [unit, setUnit] = useState(goal.kind === 'hours' ? 1 : 0)
  const [event, setEvent] = useState(null)

  useEffect(() => {
    (async () => {
      const e = await goal.event.fetch()
      setEvent(e)
    })()
  }, [goal])

  const saveGoal = () => {
    const kind = unit === 1 ? 'hours' : 'times'
    database.write(async () => {
      await goal.update((g) => {
        g.number = Number(number)
        g.kind = kind
        g.event_id = event.id
      })
    })
    RootNavigation.goBack()
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
    <View style={baseStyles.container}>
      <EventSelector
        visible={modalVisible}
        setVisible={setModalVisible}
        selected={event?.id}
        categoryId={event?.category_id}
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
      <View style={commonStyles.kindSelection}>
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
      <TouchableOpacity style={baseStyles.button} onPress={saveGoal} underlayColor='#99d9f4'>
        <Text style={baseStyles.text}>{i18n.t('save')}</Text>
      </TouchableOpacity>
    </View>
  )
}

const enhance = withObservables(['route'], ({ database, route }) => ({
  goal: database.collections.get('goals').findAndObserve(route.params.goal_id)
}))
export default withDatabase(enhance(EditGoalScreen))
