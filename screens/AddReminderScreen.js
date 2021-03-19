import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

import CheckBox from '@react-native-community/checkbox'
import SegmentedControl from '@react-native-segmented-control/segmented-control'

import CategorySelector from '../components/CategorySelector'
import Element from '../components/Element'
import * as RootNavigation from '../navigation/RootNavigation'

export default function AddReminderScreen () {
  const onPress = () => RootNavigation.navigate('ListEditCategories')

  const [modalVisible, setModalVisible] = useState(false)
  const [category, setCategory] = useState({
    id: '4',
    name: 'Rumiaciones',
    icon: 'programation'
  })
  const [question, setQuestion] = useState('')

  const [dayMode, setDayMode] = useState(0)
  const [selectedDays, setSelectedDays] = useState([
    { name: 'L', selected: false },
    { name: 'M', selected: false },
    { name: 'X', selected: false },
    { name: 'J', selected: false },
    { name: 'V', selected: false },
    { name: 'S', selected: false },
    { name: 'D', selected: false }
  ])
  const [timeMode, setTimeMode] = useState(1)

  const daySelected = (i) => {
    return function () {
      const items = [...selectedDays]
      const item = {
        ...selectedDays[i],
        selected: !selectedDays[i].selected
      }
      items[i] = item
      setSelectedDays(items)
    }
  }

  const drawDays = () => {
    const days = []

    for (let i = 0; i < 7; i++) {
      days.push(
                 <View style={styles.daySelection} key={i}>
                    <Text>{selectedDays[i].name}</Text>
                    <CheckBox
                      value={selectedDays[i].selected}
                      onValueChange={ daySelected(i) }
                    />
                </View>
      )
    }

    return days
  }

  return (
    <View style={styles.container}>
        <CategorySelector
            visible={modalVisible}
            setVisible={setModalVisible}
            selected={category.id}
            setCategory={setCategory}
        />

        <Text style={styles.title}>Pregunta</Text>
        <TextInput onChangeText={setQuestion} value={question} style={styles.input} />
        <Text style={styles.title}>Días de la semana</Text>
        <View>
              <SegmentedControl
                style={styles.kindInput}
                fontStyle={styles.kindInputText}
                values={['Elegir', 'Todos']}
                selectedIndex={dayMode}
                onChange={ (event) => {
                  setDayMode(event.nativeEvent.selectedSegmentIndex)
                }}
              />
              <View style={styles.daysSelection}>
                    {drawDays()}
              </View>
            </View>
        <Text style={styles.title}>Hora del día</Text>
        <View>
              <SegmentedControl
                style={styles.kindInput}
                fontStyle={styles.kindInputText}
                values={['Mañana', 'Tarde', 'Noche', 'Otra']}
                selectedIndex={timeMode}
                onChange={ (event) => {
                  setTimeMode(event.nativeEvent.selectedSegmentIndex)
                }}
              />
            </View>
            <View>
                <TextInput onChangeText={ undefined } style={styles.input} />
            </View>
            <View style={styles.category}>
        <Text style={styles.title}>Categoría</Text>

                <Element
                    element={category}
                    onPress={() => { setModalVisible(true) }} />
            </View>
      <TouchableOpacity style={styles.button} onPress={onPress} underlayColor='#99d9f4'>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
    </View>
  )
}

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
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
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
  category: {
    height: 180
  },
  kindSelection: {
    height: 70,
    marginTop: 15
  },
  kindInput: {
    height: 50
  },
  kindInputText: {
    fontSize: 16
  },
  daySelection: {
    alignItems: 'center'
  },
  daysSelection: {
    marginTop: 10,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})
