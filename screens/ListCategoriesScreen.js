import React from 'react'
import { useQuery } from 'react-query'
import {FlatList, Text, StyleSheet, View, ActivityIndicator} from 'react-native'
import i18n from 'i18n-js'

import * as RootNavigation from '../navigation/RootNavigation'
import { getCategories } from '../services/UmetricAPI'
import Element from '../components/Element'

export default function ListCategoriesScreen () {
  const { data, error, isError, isLoading } = useQuery('categories', getCategories)

  if (isLoading) {
    return <View><ActivityIndicator size="large" /></View>
  }
  if (isError) {
    return <View><Text>{i18n.t('somethingIsWrong')}: {error.message}...</Text></View>
  }

  const goToEvents = (item) => RootNavigation.navigate('ListEvents', { category_id: item.id, category_name: item.name })

  const renderItem = ({ item }) => (
    <Element
    element={item}
    onPress={() => goToEvents(item)} />
  )

  return (
          <FlatList
          style={styles.flatlist}
          contentContainerStyle={{ alignItems: 'center' }}
      data={data.sort((a, b) => a.order - b.order)}
      renderItem={renderItem}
      horizontal={false}
        numColumns={2}
      keyExtractor={item => item.id}
    />
  )
}

const styles = StyleSheet.create({
  flatlist: {
    paddingTop: 15,
    flex: 1
  }
})
