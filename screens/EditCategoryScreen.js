import React, { useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import t from 'tcomb-form-native';

import * as Icons from '../assets/icons';
import Icon from '../components/Icon';
import * as RootNavigation from '../navigation/RootNavigation';

export default function EditCategoryScreen() {

    const ejemplo = {
        name: 'Rutinas matutinas',
        icon: 'mountain',
        action: 'https://open.spotify.com/playlist/1Mkih2p0wnc0Iwt3lqAWZP?si=_mwzJ8CURaOTiSzSl76uTA'
    };

    const formOptions = {
        fields: {
            name: { label: 'Nombre'},
            icon: { label: 'Icono'},
            action: { label: 'Acción'}
        }
    };
    const onPress = () => RootNavigation.navigate("ListEditCategories");

    const Form = t.form.Form;

    const Category = t.struct({
        name: t.String,
        icon: t.String,
        action: t.maybe(t.String)
    });

    const [modalVisible, setModalVisible] = useState(false);
    const iconNames = Object.keys(Icons);
    console.log(iconNames);

    const renderItem = ({item}) => (
		<TouchableOpacity onPress={() => {ejemplo.icon = item; setModalVisible(false);}} >
		<View style={styles.icon}>
            <Icon icon={item} />
        </View>
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
		    <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>Elije el icono</Text>
                    <FlatList
                        style={styles.flatlist}
                        data={iconNames}
                        renderItem={renderItem}
                        horizontal={false}
                        numColumns={3}
                        keyExtractor={item => item}
                    />

                    <TouchableOpacity
                      style={styles.button}
                      underlayColor='#99d9f4'
                      onPress={() => {
                        setModalVisible(!modalVisible);
                      }}>
                      <Text style={styles.textStyle}>Me quedo con el que estaba</Text>
                    </TouchableOpacity>
                  </View>
                </View>
            </Modal>

		    <Form type={Category} options={formOptions} value={ejemplo} />
			<TouchableOpacity
			    style={styles.icon}
			    onPress={() => {
                  setModalVisible(true);
                }} >
				<Icon icon={ejemplo.icon} />
			</TouchableOpacity>
			<TouchableOpacity style={styles.button} onPress={onPress} underlayColor='#99d9f4'>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
    icon: {
		height: 70,
		width: 70,
		padding: 10
	},
	container: {
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
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
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
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
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
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
    marginBottom: 10
  },
  icon: {
    height: 90,
    width: 90,
    padding: 10
  },
});

