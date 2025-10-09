import React, { useEffect, useLayoutEffect, useState } from 'react'
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import { Feather } from '@expo/vector-icons'
import i18n from 'i18n-js'
import { Q } from '@nozbe/watermelondb'
import { getISOWeek } from 'date-fns'
import { withDatabase, withObservables } from '@nozbe/watermelondb/react'

import Goal from '../components/Goal'
import * as RootNavigation from '../navigation/RootNavigation'

function ShowGoalsScreen({ navigation, goals, eventsCount, eventLogs, database }) {
  const [commitments, setCommitments] = useState([])

  useLayoutEffect(() => {
    if (eventsCount > 0) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={() => RootNavigation.navigate('AddGoal')}
          >
            <Feather name="plus" size={30} color="black" />
          </TouchableOpacity>
        ),
    })}
  }, [navigation, eventsCount, goals])

  useEffect(() => {
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

  if (!eventsCount) {
    return (
      <View style={styles.help}>
        <Feather name="arrow-right" size={60} style={styles.swipe} />
        <Text style={styles.helpText}>{i18n.t('noEventsAtAll')}</Text>
      </View>
    )
  } else if (!goals.length) {
    return (
      <View style={styles.help}>
        <Feather name="arrow-up" size={60} style={styles.addTop} />
        <Text style={styles.helpText}>{i18n.t('noGoals')}</Text>
      </View>
    )
  } else {
    const renderItem = ({item}) => <Goal goal={item}/>

    return (
          <FlatList
              style={styles.flatlist}
              data={commitments}
              renderItem={renderItem}
              keyExtractor={(item) => '' + item.goal_id}
          />
    )
  }
}

const enhance = withObservables([], ({ database }) => ({
  goals: database.collections.get('goals').query(Q.where('active', true)).observeWithColumns(['number', 'kind', 'event_id']),
  eventsCount: database.collections.get('events').query().observeCount(),
  eventLogs: database.collections
    .get('event_logs')
    .query(Q.where('week', getISOWeek(new Date())))
    .observe(),
}))

export default withDatabase(enhance(ShowGoalsScreen))

const styles = StyleSheet.create({
  flatlist: {
    flex: 1,
  },
  actionIcon: {
    padding: 5,
    marginTop: 5,
    marginRight: 10,
  },
  help: {
    flex: 1,
  },
  swipe: {
    marginTop: '20%',
    paddingLeft: 15,
  },
  addTop: {
    marginTop: 20,
    padding: 15,
    alignSelf: 'flex-end',
  },
  helpText: {
    padding: 20,
    fontSize: 20,
    color: '#000',
    marginTop: '5%',
  },
})
