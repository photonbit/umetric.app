import React from 'react'
import {View, Text, TouchableOpacity, TextInput} from 'react-native'
import i18n from 'i18n-js'
import { baseStyles, commonStyles } from '../styles/common'
import * as RootNavigation from '../navigation/RootNavigation'
import CategorySelector from "../components/CategorySelector";
import EventSelector from "../components/EventSelector";
import {Feather} from "@expo/vector-icons";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

function AddGoalScreen({ events }) {
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

export default AddGoalScreen
