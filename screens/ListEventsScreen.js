import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import * as Linking from 'expo-linking';

import * as RootNavigation from '../navigation/RootNavigation';
import Icon from '../components/Icon';

export default function ListCategoriesScreen() {
	const onPress = () => Linking.openURL("https://open.spotify.com/playlist/7pGSSU5UcIyBVNSB3DEYbD?si=ztYl8uZHTKS7_UsnkNKQqQ");
	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.element} onPress={onPress}>
					<Icon icon="meditation" />
			</TouchableOpacity>
			<TouchableOpacity style={styles.element} onPress={onPress}>
					<Icon icon="egg" />
			</TouchableOpacity>
			<TouchableOpacity style={styles.element} onPress={onPress}>
					<Icon icon="plank" />
			</TouchableOpacity>
			<TouchableOpacity style={styles.element} onPress={onPress}>
					<Icon icon="reading" />
			</TouchableOpacity>
			<TouchableOpacity style={styles.element} onPress={onPress}>
					<Icon icon="hygiene_products" />
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexWrap: 'wrap',
		flexDirection: 'row',
		paddingTop: 50,
	},
	element: {
		width: '50%',
		padding: '5%',
		height: '25%',
	}
		
});

