import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import * as RootNavigation from '../navigation/RootNavigation';
import Icon from '../components/Icon';

export default function ListCategoriesScreen() {
	const onPress = () => RootNavigation.navigate("ListEvents");
	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.element} onPress={onPress}>
					<Icon icon="mountain" />
			</TouchableOpacity>
			<TouchableOpacity style={styles.element} onPress={onPress}>
					<Icon icon="bed" />
			</TouchableOpacity>
			<TouchableOpacity style={styles.element} onPress={onPress}>
					<Icon icon="bad_habits" />
			</TouchableOpacity>
			<TouchableOpacity style={styles.element} onPress={onPress}>
					<Icon icon="learning" />
			</TouchableOpacity>
			<TouchableOpacity style={styles.element} onPress={onPress}>
					<Icon icon="tennis" />
			</TouchableOpacity>
			<TouchableOpacity style={styles.element} onPress={onPress}>
					<Icon icon="creativity" />
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

