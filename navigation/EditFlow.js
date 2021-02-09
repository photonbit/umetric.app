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
			<EditStack.Screen name="ListEditCategories" component={EditListCategoriesScreen} options={{title: 'Editar Categorías'}}/>
			<EditStack.Screen name="ListEditEvents" component={EditListEventsScreen} options={{title: 'Editar Eventos'}} />
			<EditStack.Screen name="EditCategory" component={EditCategoryScreen} options={{title: 'Editar Categoría'}}/>
			<EditStack.Screen name="EditEvent" component={EditEventScreen} options={{title: 'Editar Evento'}} />
			<EditStack.Screen name="AddCategory" component={AddCategoryScreen} options={{title: 'Añadir Categoría'}} />
			<EditStack.Screen name="AddEvent" component={AddEventScreen} options={{title: 'Añadir Evento'}} />
		</EditStack.Navigator>
	);
}

