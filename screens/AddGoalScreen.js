import React, { useState } from 'react'
import {View, Text, TouchableOpacity, TextInput} from 'react-native'
import i18n from 'i18n-js'
import { baseStyles, commonStyles } from '../styles/common'
import * as RootNavigation from '../navigation/RootNavigation'
import CategorySelector from "../components/CategorySelector";
import Element from "../components/Element";
import EventSelector from "../components/EventSelector";
import {Feather} from "@expo/vector-icons";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
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
      const kind = unit === 0 ? 'times' : 'hours';
      await database.get('goals').create((goal) => {
          goal.number = Number(number);
          goal.kind = kind;
          goal.event_id = event.id;
          goal.active = true;
      })
  });
  RootNavigation.navigate('Metas', {screen: 'ShowGoals'});
};
  
  return (
    <View style={baseStyles.container}>
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
          <Text style={baseStyles.title}>{i18n.t('wantToDedicate')}</Text>
          <View style={commonStyles.numberSelection}>
            <TouchableOpacity
                onPress={ () => setNumber((Number(number) - 1).toString())}
                style={commonStyles.numberButton}
            >
                <Feather name="minus-circle" size={40} color="black" />
            </TouchableOpacity>
            <TextInput
                onChangeText={setNumber}
                defaultValue={number}
                style={commonStyles.numberInput}
                keyboardType="number-pad"
            />
            <TouchableOpacity
                onPress={ () => setNumber((Number(number) + 1).toString())}
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
                onChange={ (event) => {
                  setUnit(event.nativeEvent.selectedSegmentIndex)
                }}
              />
          </View>
           <View style={commonStyles.categorySelection}>
        <Text style={baseStyles.title}>{i18n.t('perWeekTo')}:</Text>
                <Element
                    element={event}
                    onPress={() => { setCategoryModalVisible(true) }} />
            </View>
            <TouchableOpacity style={baseStyles.button} onPress={saveGoal} underlayColor='#99d9f4'>
              <Text style={baseStyles.buttonText}>{i18n.t('save')}</Text>
            </TouchableOpacity>
        </View>
  )
}

export default withDatabase(AddGoalScreen)
