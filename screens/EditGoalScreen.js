import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { Feather } from '@expo/vector-icons'
import { useQuery, useQueryClient, useMutation } from 'react-query'

import EventSelector from '../components/EventSelector'
import Element from '../components/Element'
import * as RootNavigation from '../navigation/RootNavigation'
import { getGoal, editGoal } from '../services/UmetricAPI'

export default function EditGoalScreen ({ route }) {
  const goalId = route.params.goal_id
  const [modalVisible, setModalVisible] = useState(false)
  const [number, setNumber] = useState('')
  const [unit, setUnit] = useState('')
  const [event, setEvent] = useState({
    id: '',
    name: '',
    icon: ''
  })

  const { data, error, isError, isLoading } = useQuery(['goal', goalId],
    ({ queryKey }) => {
      return getGoal({ queryKey }).then((goal) => {
        setNumber('' + goal.number)
        setUnit(goal.unit)
        setEvent(goal.event)
        return goal
      })
    })
  const mutation = useMutation(
    (modifiedGoal) => editGoal({ goalId, modifiedGoal }))
  const { isSuccess } = mutation
  const queryClient = useQueryClient()

  const saveGoal = () => {
    mutation.mutate({
      number: number,
      unit: unit,
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
    if (isSuccess) {
      queryClient.invalidateQueries('goal', goalId).then(() =>
        queryClient.invalidateQueries('commitments').then(() =>
          RootNavigation.navigate('ShowGoals')
        ))
    }
  }, [isSuccess])

  if (isLoading) {
    return <View><Text>Loading...</Text></View>
  }
  if (isError) {
    return <View><Text>Something is wrong: {error.message}...</Text></View>
  }

  return (
    <View style={styles.container}>
     <EventSelector
            visible={modalVisible}
            setVisible={setModalVisible}
            selected={event.id}
            setEvent={setEvent}
           />
          <Text style={styles.title}>Quieres dedicar</Text>
          <View style={styles.numberSelection}>
            <TouchableOpacity
                onPress={plusOne}
                style={styles.numberButton}
            >
                <Feather name="minus-circle" size={40} color="black" />
            </TouchableOpacity>
            <TextInput
                onChangeText={setNumber}
                defaultValue={data.number.toString()}
                style={styles.numberInput}
                keyboardType="number-pad"
            />
            <TouchableOpacity
                onPress={minusOne}
                style={styles.numberButton}
            >
                <Feather name="plus-circle" size={40} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.kindSelection}>
              <SegmentedControl
                style={styles.kindInput}
                fontStyle={styles.kindInputText}
                values={['veces', 'horas']}
                selectedIndex={unit}
                onChange={ (event) => {
                  setUnit(event.nativeEvent.selectedSegmentIndex)
                }}
              />
          </View>
           <View style={styles.categorySelection}>
        <Text style={styles.title}>a la semana a:</Text>
                <Element
                    element={event}
                    onPress={() => { setModalVisible(true) }} />
            </View>
            <TouchableOpacity style={styles.button} onPress={saveGoal} underlayColor='#99d9f4'>
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
