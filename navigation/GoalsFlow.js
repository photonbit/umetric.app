import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ShowGoalsScreen from '../screens/ShowGoalsScreen';

const GoalsStack = createStackNavigator();

export function GoalsFlow() {
	return (
		<GoalsStack.Navigator>
			<GoalsStack.Screen name="ShowGoals" component={ShowGoalsScreen} options={{title: 'Ver Metas'}} />
		</GoalsStack.Navigator>
	);
}
