import React from 'react';
import { useWindowDimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { BasicInputFlow } from './InputFlow';
import { EditFlow } from './EditFlow';
import { navigationRef } from './RootNavigation';

const Drawer = createDrawerNavigator()


export default function CompleteFlow() {
	return (
		<NavigationContainer ref={navigationRef}>
			<Drawer.Navigator>
				<Drawer.Screen name="Input" component={BasicInputFlow} />
				<Drawer.Screen name="Edit" component={EditFlow} />
			</Drawer.Navigator>
		</NavigationContainer>
	);
}

