import React, { useLayoutEffect, useEffect, useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View, Text, ActivityIndicator } from 'react-native'
import { Feather } from '@expo/vector-icons'
import i18n from 'i18n-js'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { Q } from '@nozbe/watermelondb'
import { baseStyles } from '../styles/common'

import Goal from '../components/Goal'
import * as RootNavigation from '../navigation/RootNavigation'

function getCurrentWeek() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const dayOffset = ((start.getDay() + 6) % 7)
  const diff = now - start + dayOffset * 86400000
  return Math.ceil(diff / (7 * 86400000))
}

function ShowGoalsScreen({ navigation, goals }) {
  const database = useDatabase()
  const [commitments, setCommitments] = useState([])
  const [loading, setLoading] = useState(true)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
            <TouchableOpacity style={styles.actionIcon} onPress={() => RootNavigation.navigate('AddGoal')}>
                <Feather name="plus" size={30} color="black" />
            </TouchableOpacity>
      )
    })
  }, [])

  useEffect(() => {
    const fetchCommitments = async () => {
      const currentWeek = getCurrentWeek()
      const goalsCollection = database.get('goals')
      const logsCollection = database.get('logs')

      const goals = await goalsCollection.query().fetch()
      const logs = await logsCollection.query(Q.where('week', currentWeek)).fetch()

      const commitments = goals.map(goal => {
        const done = logs.filter(log => log.goal_id === goal.id).length
        return { ...goal, done }
      })

      setCommitments(commitments)
      setLoading(false)
    }

    fetchCommitments()
  }, [database])

  const renderItem = ({ item }) => (
        <Goal goal={item} />
  )

  if (loading) {
    return <View><ActivityIndicator size="large" /></View>
  }

  return (
    <View style={baseStyles.container}>
      <FlatList
        style={styles.flatlist}
        persistentScrollbar={true}
        contentContainerStyle={{ alignItems: 'flex-end', justifyContent: 'space-between' }}
        data={commitments}
        renderItem={renderItem}
        horizontal={true}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

export default ShowGoalsScreen;

const styles = StyleSheet.create({
  flatlist: {
    paddingTop: 15,
    flex: 1,
    paddingBottom: 50
  },
  actionIcon: {
    padding: 5,
    marginTop: 5,
    marginRight: 10
  }
})
