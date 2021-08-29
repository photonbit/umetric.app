import React, {useEffect, useState} from 'react'
import { FlatList, StyleSheet } from 'react-native'

import * as RootNavigation from '../navigation/RootNavigation'
import { get_categories } from '../services/UmetricAPI'
import Element from '../components/Element'

export default function ListCategoriesScreen () {
  const [categories, setCategories] = useState([])

  function set_categories(response) {
    setCategories(response.data)
  }

  useEffect(() => {
    get_categories(set_categories, console.error)
  })

  const go_to_events = (item) => RootNavigation.navigate('ListEvents', {category_id: item.id})

  const renderItem = ({ item }) => (
    <Element
    element={item}
    onPress={() => go_to_events(item)} />
  )
  return (
          <FlatList
          style={styles.flatlist}
          contentContainerStyle={{ alignItems: 'center' }}
      data={categories}
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
