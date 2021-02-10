import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';

import * as RootNavigation from '../navigation/RootNavigation';
import Icon from '../components/Icon';
import Element from '../components/Element';

export default function ListCategoriesScreen() {
	const onPress = () => Linking.openURL("https://open.spotify.com/playlist/7pGSSU5UcIyBVNSB3DEYbD?si=ztYl8uZHTKS7_UsnkNKQqQ");
    const eventos = [
		{
			"id": "1",
			"name": "Meditación",
			"icon": "meditation",
			"action": "https://open.spotify.com/playlist/2HgRpBLGchiOoYwonvu9IV?si=j-UbXrl5S0KFXyDmosk54Q"
		},
		{
			"id": "2",
			"name": "Desayuno",
			"icon": "egg",
			"action": "https://open.spotify.com/playlist/3nmxhZ8KAna4mG5HmSaERR?si=rCF54mgtT1uYLNzM3SF87Q"
		},
		{
			"id": "3",
			"name": "Abdominales",
			"icon": "plank",
			"action": "https://open.spotify.com/playlist/3kMuOZl1fk3OEFb9t8gUiM?si=9MPa7FvwTLqtSD7FS9qpLQ"
		},
		{
			"id": "4",
			"name": "Lectura humana",
			"icon": "open_book",
			"action": "https://open.spotify.com/playlist/3kMuOZl1fk3OEFb9t8gUiM?si=9MPa7FvwTLqtSD7FS9qpLQ"
		},
		{
			"id": "5",
			"name": "Ducha",
			"icon": "hygiene_products",
			"action": "https://open.spotify.com/playlist/3kMuOZl1fk3OEFb9t8gUiM?si=9MPa7FvwTLqtSD7FS9qpLQ"
		},
	];

	const renderItem = ({item}) => (
		<Element
		element={item}
		onPress={onPress} />
	);
	return (
	        <FlatList
	        style={styles.flatlist}
			data={eventos}
			renderItem={renderItem}
			horizontal={false}
		    numColumns={2}
			keyExtractor={item => item.id}
		/>
	);
}

const styles = StyleSheet.create({
	flatlist: {
	    paddingTop: 15,
		flex: 1,
	}
});

