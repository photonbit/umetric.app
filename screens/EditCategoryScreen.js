import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import t from 'tcomb-form-native';

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

	return (
		<View style={styles.container}>
		    <Form type={Category} options={formOptions} value={ejemplo} />
			<TouchableOpacity style={styles.icon} onPress={onPress} >
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
    marginTop: 50,
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
  }
});

