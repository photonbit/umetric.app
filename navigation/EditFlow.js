import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import EditListCategoriesScreen from '../screens/EditListCategoriesScreen';
import EditListEventsScreen from '../screens/EditListEventsScreen';
import EditCategoryScreen from '../screens/EditCategoryScreen';
import EditEventScreen from '../screens/EditEventScreen';
import AddCategoryScreen from '../screens/AddCategoryScreen';
import AddEventScreen from '../screens/AddEventScreen';

const EditStack = createStackNavigator();

export function EditFlow() {
	return (
		<EditStack.Navigator>
			<EditStack.Screen name="ListCategories" component={EditListCategoriesScreen} />
			<EditStack.Screen name="ListEvents" component={EditListEventsScreen} />
			<EditStack.Screen name="EditCategory" component={EditCategoryScreen} />
			<EditStack.Screen name="EditEvent" component={EditEventScreen} />
			<EditStack.Screen name="AddCategory" component={AddCategoryScreen} />
			<EditStack.Screen name="AddEvent" component={AddEventScreen} />
		</EditStack.Navigator>
	);
}

