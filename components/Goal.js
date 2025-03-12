import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

import Icon from '../components/Icon'
import * as RootNavigation from '../navigation/RootNavigation'

export default function Goal({ goal }) {
  const [action, setAction] = useState(false)

  const DoneSquare = (key) => {
    return <View style={styles.done} key={key} />
  }

  const NotDoneSquare = (key) => {
    return <View style={styles.notDone} key={key} />
  }

  const OverdoneSquare = (key) => {
    return <View style={styles.overDone} key={key} />
  }

  const drawGoal = () => {
    const squares = []

    if (goal.committed > goal.done) {
      for (let i = goal.done; i < goal.committed; i++) {
        squares.push(<NotDoneSquare key={i} />)
      }
      for (let i = 0; i < goal.done; i++) {
        squares.push(<DoneSquare key={i} />)
      }
    } else {
      for (let i = goal.committed; i < goal.done; i++) {
        squares.push(<OverdoneSquare key={i} />)
      }
      for (let i = 0; i < goal.committed; i++) {
        squares.push(<DoneSquare key={i} />)
      }
    }
    return squares
  }

  const drawFooter = () => {
    const goToPomodoro = () => RootNavigation.navigate('Pomodoro', { event: goal.event })
    const gotoEdit = () => RootNavigation.navigate('EditGoal', { goal_id: goal.goal_id, event_id: goal.event.id })

    if (action) {
      return (
        <View>
          <TouchableOpacity onPress={goToPomodoro} style={styles.icon}>
            <Icon icon="Circle" />
          </TouchableOpacity>
          <TouchableOpacity onPress={gotoEdit} style={styles.icon}>
            <Icon icon="Pencil" />
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <TouchableOpacity style={styles.icon} onPress={() => setAction(!action)}>
          <Icon icon={goal.event.icon} />
        </TouchableOpacity>
      )
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setAction(!action)}>{drawGoal()}</TouchableOpacity>
      {drawFooter()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 50,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  done: {
    backgroundColor: '#48BBEC',
    width: 40,
    height: 40,
    padding: 1,
    margin: 5,
  },
  notDone: {
    borderColor: '#48BBEC',
    borderWidth: 4,
    width: 40,
    height: 40,
    padding: 1,
    margin: 5,
  },
  overDone: {
    backgroundColor: '#2093C4',
    width: 40,
    height: 40,
    padding: 1,
    margin: 5,
  },
  icon: {
    width: 50,
    height: 50,
    margin: 5,
    padding: 1,
  },
})
