import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ShowGoalsScreen from '../screens/ShowGoalsScreen';
import PomodoroScreen from '../screens/PomodoroScreen';

const GoalsStack = createStackNavigator();

export function GoalsFlow() {
	return (
		<GoalsStack.Navigator>
			<GoalsStack.Screen name="ShowGoals" component={ShowGoalsScreen} options={{title: 'Ver Metas'}} />
			<GoalsStack.Screen name="Pomodoro" component={PomodoroScreen} options={{title: 'Pomodoro'}} />
		</GoalsStack.Navigator>
	);
}
