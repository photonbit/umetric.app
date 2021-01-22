import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ListCategoriesScreen from '../screens/ListCategoriesScreen';
import ListEventsScreen from '../screens/ListEventsScreen';

const BasicInputStack = createStackNavigator();

export function BasicInputFlow() {
	return (
		<BasicInputStack.Navigator>
			<BasicInputStack.Screen name="ListCategories" component={ListCategoriesScreen} />
			<BasicInputStack.Screen name="ListEvents" component={ListEventsScreen} />
		</BasicInputStack.Navigator>
	);
}

