import React, {useLayoutEffect} from 'react'
import { useQuery } from 'react-query'
import {FlatList, Text, StyleSheet, View, ActivityIndicator, TouchableOpacity} from 'react-native'
import i18n from 'i18n-js'

import * as RootNavigation from '../navigation/RootNavigation'
import UmetricAPI from '../services/UmetricAPI'
import Element from '../components/Element'
import {Feather} from "@expo/vector-icons";

export default function ListCategoriesScreen ({ navigation }) {
  const { getCategories } = UmetricAPI()
  const { data, error, isError, isLoading } = useQuery('categories', getCategories)


  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
            <TouchableOpacity style={styles.actionIcon} onPress={() => RootNavigation.navigate('Metas', {screen: 'ShowGoals'})}>
                <Feather name="bar-chart-2" size={25} color="black" />
            </TouchableOpacity>
      )
    })
  }, [])

  if (isLoading) {
    return <View><ActivityIndicator size="large" /></View>
  }
  if (isError) {
    return <View><Text>{i18n.t('somethingIsWrong')}: {error.message}...</Text></View>
  }

  if (data.length === 0) {
    return (
        <View style={styles.help}>
          <Feather name='arrow-right' size={60} style={styles.swipe}/>
          <Text style={styles.helpText}>{i18n.t('noCategories')}</Text>
        </View>
    )
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
  },
  help: {
    flex: 1,
  },
  swipe: {
    marginTop: '20%',
    paddingLeft: 15
  },
  helpText: {
    padding: 20,
    fontSize: 20,
    color: '#000',
    marginTop: '5%',
  },
  actionIcon: {
    padding: 5,
    marginTop: 5,
    marginRight: 10,
  }
})
