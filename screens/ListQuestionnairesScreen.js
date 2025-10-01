// screens/ListQuestionnairesScreen.js
import React from 'react'
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native'
import { mergeMap } from 'rxjs/operators'

import { useNavigation } from '@react-navigation/native'
import { withDatabase, withObservables } from '@nozbe/watermelondb/react'

const ListQuestionnairesScreen = ({ questionnaires }) => {
  const navigation = useNavigation()

  const Item = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('Questionnaire', { questionnaire_id: item.id })}
    >
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.shortName}>{item.short_name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.source}>Source: {item.source}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatlist}
        data={questionnaires}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Item item={item} />}
      />
    </View>
  )
}

const enhance = withObservables([], ({ database }) => ({
  questionnaires: database.collections
    .get('questionnaires')
    .query()
    .observeWithColumns([])
    .pipe(
      mergeMap(async (items) => {
        const results = []
        for (const q of items) {
          results.push({ id: q.id, ...(await q.getLocalizedInstance()) })
        }
        return results
      }),
    ),
}))

export default withDatabase(enhance(ListQuestionnairesScreen))

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatlist: {
    flex: 1,
  },
  item: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  shortName: {
    fontSize: 16,
    color: 'gray',
  },
  description: {
    paddingTop: 8,
  },
  source: {
    paddingTop: 8,
    fontStyle: 'italic',
    fontSize: 12,
  },
})
