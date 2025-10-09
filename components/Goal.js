import React from 'react'
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native'
import {Feather} from '@expo/vector-icons'

import Icon from '../components/Icon'
import * as RootNavigation from '../navigation/RootNavigation'

export default function Goal({goal}) {
    const goToPomodoro = () => RootNavigation.navigate('Pomodoro', {event: goal.event})
    const goToEdit = () => RootNavigation.navigate('EditGoal', {goal_id: goal.goal_id, event_id: goal.event.id})

    const progressPercentage = goal.committed > 0 ? Math.min((goal.done / goal.committed) * 100, 100) : 0
    const isOverdone = goal.done > goal.committed

    return (
        <View style={styles.container}>
            <View style={styles.element}>
                <TouchableOpacity style={styles.icon} onPress={goToEdit}>
                    <Icon icon={goal.event.icon}/>
                </TouchableOpacity>

                <TouchableOpacity style={styles.title} onPress={goToEdit}>
                    <Text numberOfLines={2} style={styles.text}>
                        {goal.event.name}
                    </Text>
                </TouchableOpacity>

                {goal.kind === 'hours' && (
                    <TouchableOpacity style={styles.pomodoroButton} onPress={goToPomodoro}>
                        <Feather name="watch" size={40} color="#48BBEC"/>
                    </TouchableOpacity>
                )}

            </View>
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${progressPercentage}%`,
                                backgroundColor: isOverdone ? '#2093C4' : '#48BBEC'
                            }
                        ]}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        borderBottomWidth: 4,
        borderBottomColor: 'white',
    },
    element: {
        flex: 1,
        flexDirection: 'row',
        alignContent: 'center',
        flexWrap: 'wrap',
        height: 100,
        paddingLeft: 10,
        paddingRight: 10,

    },
    order: {
        flex: 1,
        justifyContent: 'space-between',
    },
    upIcon: {
        paddingBottom: 1,
    },
    downIcon: {
        paddingTop: 1,
    },
    title: {
        paddingTop: 16,
        width: 240,
        height: 60,
        overflow: 'hidden',
        paddingLeft: 10,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        overflow: 'hidden'
    },
    icon: {
        height: 60,
        width: 60,
    },
    goalText: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    pomodoroButton: {
        padding: 5,
        position: 'absolute',
        right: 20,
        top: 30,
    },
    progressContainer: {
        width: '95%',
        flex: 1,
        alignSelf: 'center',
        marginBottom: 10,
    },
    progressBar: {
        height: 12,
        backgroundColor: '#E0E0E0',
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 6,
    },
})
