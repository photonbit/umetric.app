import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import NumericInput from 'react-native-numeric-input';
import SegmentedControl from '@react-native-segmented-control/segmented-control';

import CategorySelector from '../components/CategorySelector';
import Element from '../components/Element';
import * as RootNavigation from '../navigation/RootNavigation';


export default function AddGoalScreen() {

    const onPress = () => RootNavigation.navigate("ShowGoals");

    const [modalVisible, setModalVisible] = useState(false);
    const [category, setCategory] = useState({
			"id": "4",
			"name": "Rumiaciones",
			"icon": "programation",
    });
    const [number, setNumber] = useState(1);
    const [unit, setUnit] = useState(1)

	return (
		<View style={styles.container}>
		 <CategorySelector
            visible={modalVisible}
            setVisible={setModalVisible}
            selected={category.id}
            setCategory={setCategory}
           />
          <Text style={styles.title}>Quieres dedicar</Text>
          <NumericInput
            value={number}
            onChange={setNumber}
            minValue={1}
            rounded
          />
          <SegmentedControl
            values={['veces', 'horas']}
            selectedIndex={unit}
            onChange={ (event) => {
              setUnit(event.nativeEvent.selectedSegmentIndex);
            }}
          />
           <View style={styles.category}>
		    <Text style={styles.title}>a la semana a:</Text>

                <Element
                    element={category}
                    onPress={() => {setModalVisible(true);}}  />
            </View>
            <TouchableOpacity style={styles.button} onPress={onPress} underlayColor='#99d9f4'>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
        </View>
	);
}

const styles = StyleSheet.create({
    icon: {
        height: 90,
        width: 90,
        padding: 10
    },
    container: {
        flex: 1,
        padding: 20,
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
        fontWeight: 'bold',
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
        marginTop: 5,
    },
    category: {
        height: 200,
    }
});

