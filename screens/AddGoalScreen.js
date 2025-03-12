import React, { useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native'
import i18n from 'i18n-js'
import * as RootNavigation from '../navigation/RootNavigation'
import CategorySelector from '../components/CategorySelector'
import Element from '../components/Element'
import EventSelector from '../components/EventSelector'
import { Feather } from '@expo/vector-icons'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { withDatabase } from '@nozbe/watermelondb/react'

function AddGoalScreen({ database }) {
  const [categoryModalVisible, setCategoryModalVisible] = useState(false)
  const [eventModalVisible, setEventModalVisible] = useState(false)
  const [category, setCategory] = useState({ id: '', name: '', icon: 'Apple' })
  const [event, setEvent] = useState({ id: '', name: '', icon: 'Apple' })
  const [number, setNumber] = useState('1')
  const [unit, setUnit] = useState(0)

  const saveCategory = (cat) => {
    setCategory(cat)
    setCategoryModalVisible(false)
    setEventModalVisible(true)
  }

  const saveGoal = async () => {
    await database.write(async () => {
        const kind = unit === 0 ? 'times' : 'hours'
        await database.get('goals').create((goal) => {
            goal.number = Number(number)
            goal.kind = kind
            goal.active = true
            goal.event_id = event.id
        })
    })
    RootNavigation.navigate('Metas', { screen: 'ShowGoals' })
  }

  return (
    <View style={styles.container}>
      <CategorySelector
        visible={categoryModalVisible}
        setVisible={setCategoryModalVisible}
        selected={category.id}
        setCategory={saveCategory}
      />
      <EventSelector
        visible={eventModalVisible}
        categoryId={category.id}
        setVisible={setEventModalVisible}
        selected={event.id}
        setEvent={setEvent}
      />
      <Text style={styles.title}>{i18n.t('wantToDedicate')}</Text>
      <View style={styles.numberSelection}>
        <TouchableOpacity
          onPress={() => setNumber((Number(number) - 1).toString())}
          style={styles.numberButton}
        >
          <Feather name="minus-circle" size={40} color="black" />
        </TouchableOpacity>
        <TextInput
          onChangeText={setNumber}
          defaultValue={number}
          style={styles.numberInput}
          keyboardType="number-pad"
        />
        <TouchableOpacity
          onPress={() => setNumber((Number(number) + 1).toString())}
          style={styles.numberButton}
        >
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
        <Text style={styles.title}>{i18n.t('perWeekTo')}:</Text>
        <Element
          element={event}
          onPress={() => {
            setCategoryModalVisible(true)
          }}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={saveGoal} underlayColor="#99d9f4">
        <Text style={styles.buttonText}>{i18n.t('save')}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default withDatabase(AddGoalScreen)

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
  },
})