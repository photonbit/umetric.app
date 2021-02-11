import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import t from 'tcomb-form-native';

import IconSelector from '../components/IconSelector'
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
            action: { label: 'Acción'}
        }
    };
    const onPress = () => RootNavigation.navigate("ListEditCategories");

    const Form = t.form.Form;

    const Category = t.struct({
        name: t.String,
        action: t.maybe(t.String)
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [icon, setIcon] = useState("mountain");

	return (
		<View style={styles.container}>
		    <IconSelector
		        visible={modalVisible}
		        setVisible={setModalVisible}
		        selected={icon}
		        setIcon={setIcon}
		    />

		    <Form type={Category} options={formOptions} value={ejemplo} />
		    <Text style={styles.title}>Icono</Text>
			<TouchableOpacity
			    style={styles.icon}
			    onPress={() => {
                  setModalVisible(true);
                }} >
				<Icon icon={icon} />
			</TouchableOpacity>
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
    title: {
        fontSize: 18
    }
});

