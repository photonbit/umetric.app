import React from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';

import EditableElement from '../components/EditableElement';
import * as RootNavigation from '../navigation/RootNavigation';

export default function EditListCategoriesScreen() {
	const categorias = [
		{
			"id": "1",
			"name": "Rutinas matutinas",
			"icon": "mountain",
		},
		{
			"id": "2",
			"name": "Rutinas nocturnas",
			"icon": "bed",
		},
		{
			"id": "3",
			"name": "Comportamientos evitativos",
			"icon": "bad_habits",
		},
		{
			"id": "4",
			"name": "Deportes",
			"icon": "tennis",
		},
	];


    const onNamePress = () => RootNavigation.navigate("ListEditEvents");
    const onEditPress = () => RootNavigation.navigate("EditCategory");
    const onDeletePress = () => Alert.alert(
      'Borrar Categoría',
      'Que la vas a borrar',
      [
        {
          text: 'Vale, no',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        { text: 'Sí', onPress: () => console.log('OK Pressed') }
      ],
      { cancelable: false }
    );

	const renderItem = ({item}) => (
		<EditableElement
		element={item}
		type="category"
		onNamePress={onNamePress}
		onEditPress={onEditPress}
		onDeletePress={onDeletePress} />
	);
	return (
	        <FlatList
			style={styles.flatlist}
			data={categorias}
			renderItem={renderItem}
			keyExtractor={item => item.id}
		/>
	);
}

const styles = StyleSheet.create({
	flatlist: {
		flex: 1,
	}
});

