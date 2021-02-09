import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import Element from '../components/Element';

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

	const renderItem = ({item}) => (
		<Element element={item} type="category" />
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

