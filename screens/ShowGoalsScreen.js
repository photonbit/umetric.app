import React, { useEffect, useLayoutEffect, useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { Q } from '@nozbe/watermelondb'
import { baseStyles } from '../styles/common'
import { getISOWeek } from 'date-fns'
import { withDatabase, withObservables } from '@nozbe/watermelondb/react'

import Goal from '../components/Goal'
import * as RootNavigation from '../navigation/RootNavigation'

function ShowGoalsScreen({ navigation, goals, eventLogs, database }) {
  const [commitments, setCommitments] = useState([])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.actionIcon}
          onPress={() => RootNavigation.navigate('AddGoal')}
        >
          <Feather name="plus" size={30} color="black" />
        </TouchableOpacity>
      ),
    })
  }, [navigation])

  useEffect(() => {
    if (!goals) return
    const fetchData = async () => {
      const computed = []
      for (const g of goals) {
        try {
          const e = await database.collections.get('events').find(g.event_id)
          const goalLogs = eventLogs.filter((l) => l.event_id === e.id)
          let done = 0
          if (g.kind === 'times') {
            done = goalLogs.length
          } else if (g.kind === 'hours') {
            done = goalLogs.reduce((acc, l) => acc + (l.duration || 0), 0) / 3600
          }
          computed.push({
            goal_id: g.id,
            committed: g.number,
            kind: g.kind,
            done,
            event: { id: e.id, name: e.name, icon: e.icon },
          })
        } catch (error) {
          console.log('Error fetching event for goal', error)
        }
      }
      setCommitments(computed)
    }
    fetchData()
  }, [goals, eventLogs, database])

  const renderItem = ({ item }) => <Goal goal={item} />

  return (
    <View style={baseStyles.container}>
      <FlatList
        style={styles.flatlist}
        persistentScrollbar={true}
        contentContainerStyle={{ alignItems: 'flex-end', justifyContent: 'space-between' }}
        data={commitments}
        renderItem={renderItem}
        horizontal={true}
      />
    </View>
  )
}

const enhance = withObservables([], ({ database }) => ({
  goals: database.collections.get('goals').query(Q.where('active', true)).observeWithColumns(['number', 'kind', 'event_id']),
  eventLogs: database.collections
    .get('event_logs')
    .query(Q.where('week', getISOWeek(new Date())))
    .observe(),
}))

export default withDatabase(enhance(ShowGoalsScreen))

const styles = StyleSheet.create({
  flatlist: {
    paddingTop: 15,
    flex: 1,
    paddingBottom: 50,
  },
  actionIcon: {
    padding: 5,
    marginTop: 5,
    marginRight: 10,
  },
})
