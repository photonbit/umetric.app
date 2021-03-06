import React, { useLayoutEffect } from 'react';
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import EditableElement from '../components/EditableElement';
import * as RootNavigation from '../navigation/RootNavigation';

export default function EditListEventsScreen({ navigation }) {
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


    const onNamePress = () => RootNavigation.navigate("OpenAction");
    const onEditPress = () => RootNavigation.navigate("EditEvent");
    const onDeletePress = () => Alert.alert(
      'Borrar Evento',
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

    useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity style={styles.actionIcon} onPress={() => RootNavigation.navigate("AddEvent")}>
                <Feather name="file-plus" size={30} color="black" />
            </TouchableOpacity>
          ),
        });
    });

	const renderItem = ({item}) => (
		<EditableElement
		element={item}
		onNamePress={onNamePress}
		onEditPress={onEditPress}
		onDeletePress={onDeletePress} />
	);
	return (
	        <FlatList
			style={styles.flatlist}
			data={eventos}
			renderItem={renderItem}
			keyExtractor={item => item.id}
		/>
	);
}

const styles = StyleSheet.create({
	flatlist: {
		flex: 1,
	},
	actionIcon: {
	    padding: 5,
	    marginTop: 5,
	    marginRight: 10
	},
});
