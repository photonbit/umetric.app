import React from 'react';
import { Alert, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Octicons } from '@expo/vector-icons'; 

import Icon from './Icon';

export default function Element({element, type, onNamePress, onEditPress, onDeletePress}) {
	return (
		<View style={styles.element}>
			<TouchableOpacity style={styles.icon} onPress={onNamePress} >
				<Icon icon={element.icon} />		
			</TouchableOpacity>
			<TouchableOpacity style={styles.title} onPress={onNamePress}>
				<Text numberOfLines={2} style={styles.text}>{element.name}</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.actionIcon} onPress={onEditPress}>
				<Octicons name="pencil" size={32} color="black" />
			</TouchableOpacity>
			<TouchableOpacity style={styles.actionIcon} onPress={onDeletePress}>
				<Octicons name="trashcan" size={32} color="black" />
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	element: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignContent: 'stretch',
		flexWrap: 'wrap',
		height: 60,
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: 'black'
	},
	icon: {
		height: 40,
		width: 40
	},
	actionIcon: {
	    padding: 5
	},
	title: {
	    width: 120,
		height: 40,
		overflow: 'hidden'
	},
	text: {
		fontSize: 16,
		fontWeight: 'bold',
		overflow: 'hidden'
	}
		
});
