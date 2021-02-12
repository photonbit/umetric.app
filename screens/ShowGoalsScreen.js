import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Goal from '../components/Goal';
import * as RootNavigation from '../navigation/RootNavigation';
import Icon from '../components/Icon';


export default function ShowGoalsScreen() {

    const categorias = [
		{
			"id": "1",
			"name": "Cuidados",
			"icon": "garden",
			"committed": 6,
			"done": 2
		},
		{
		    "id": "2",
		    "name": "Aprendizaje",
		    "icon": "thinking",
		    "committed": 5,
		    "done": 3
		},
		{
		    "id": "3",
		    "name": "Empresa",
		    "icon": "online",
		    "committed": 2,
		    "done": 5
		},
		{
		    "id": "4",
		    "name": "Deporte",
		    "icon": "running",
		    "committed": 7,
		    "done": 6
		},
		{
		    "id": "5",
		    "name": "Arte",
		    "icon": "visualization",
		    "committed": 3,
		    "done": 0
		},
	];

	const renderItem = ({item}) => {
        const onPress = () => RootNavigation.navigate("Pomodoro", { category: item});

        return (
            <TouchableOpacity onPress={onPress}>
                <Goal
                category={item}
                committed={item.committed}
                done={item.done} />
            </TouchableOpacity>
	)};

	return (
	        <FlatList
	        style={styles.flatlist}
	        contentContainerStyle={{alignItems: 'flex-end', justifyContent: 'space-between'}}
			data={categorias}
			renderItem={renderItem}
			horizontal={true}
			keyExtractor={item => item.id}
		/>
	);
}

const styles = StyleSheet.create({
	flatlist: {
	    paddingTop: 15,
		flex: 1,
		paddingBottom: 50
	}
});

