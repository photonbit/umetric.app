import React, { useLayoutEffect } from 'react'
import {Alert, FlatList, StyleSheet, TouchableOpacity, View, Text} from 'react-native'
import { Feather } from '@expo/vector-icons'
import i18n from 'i18n-js'

import EditableElement from '../components/EditableElement'
import * as RootNavigation from '../navigation/RootNavigation'
import { Q } from '@nozbe/watermelondb'
import { withDatabase, withObservables } from '@nozbe/watermelondb/react'

function EditListCategoriesScreen({ navigation, categories, database }) {
  const deleteCategory = async (categoryId) => {
    await database.write(async () => {
      const category = await database.get('categories').find(categoryId)
      await category.markAsDeleted()
    })
  }

  const updateCategoryOrder = async (updatedCategories) => {
    await database.write(async () => {
      for (const cat of updatedCategories) {
        const category = await database.get('categories').find(cat.id)
        await category.update((c) => {
          c.order = cat.order
        })
      }
    })
  }

  const onNamePress = (item) => RootNavigation.navigate('ListEditEvents', { category_id: item.id })
  const onEditPress = (item) => RootNavigation.navigate('EditCategory', { category_id: item.id })
  const onDeletePress = (item) =>
    Alert.alert(
      i18n.t('delete') + ' ' + item.name + '?',
      i18n.t('confirmDelete'),
      [
        {
          text: i18n.t('okNo'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: i18n.t('yes'), onPress: () => deleteCategory(item.id) },
      ],
      { cancelable: false },
    )

  const onUpPress = (item) => {
    const index = categories.findIndex((e) => e.id === item.id)
    if (index > 0) {
      const oldPrev = categories[index - 1]
      const itemOrder = { id: item.id, order: oldPrev.order }
      const oldPrevOrder = { id: oldPrev.id, order: item.order }

      updateCategoryOrder([itemOrder, oldPrevOrder])
    }
  }

  const onDownPress = (item) => {
    const index = categories.findIndex((e) => e.id === item.id)
    if (index < categories.length - 1) {
      const oldNext = categories[index + 1]
      const itemOrder = { id: item.id, order: oldNext.order }
      const oldNextOrder = { id: oldNext.id, order: item.order }

      updateCategoryOrder([itemOrder, oldNextOrder])
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.actionIcon}
          onPress={() => RootNavigation.navigate('AddCategory')}
        >
          <Feather name="folder-plus" size={30} color="black" />
        </TouchableOpacity>
      ),
    })
  }, [])

  if (categories.length === 0) {
    return (
      <View style={styles.help}>
        <Feather name="arrow-up" size={60} style={styles.addTop} />
        <Text style={styles.helpText}>{i18n.t('noEditCategories')}</Text>
      </View>
    )
  }

  const renderItem = ({ item }) => (
    <EditableElement
      element={item}
      onNamePress={() => onNamePress(item)}
      onEditPress={() => onEditPress(item)}
      onDeletePress={() => onDeletePress(item)}
      onDownPress={() => onDownPress(item)}
      onUpPress={() => onUpPress(item)}
    />
  )
  return (
    <FlatList
      style={styles.flatlist}
      data={categories}
      renderItem={renderItem}
      keyExtractor={(item) => '' + item.id}
    />
  )
}

EditListCategoriesScreen.displayName = 'EditListCategoriesScreen'

const enhance = withObservables([], ({ database }) => ({
  categories: database.collections
    .get('categories')
    .query(Q.sortBy('order'))
    .observeWithColumns(['name', 'icon', 'active', 'order']),
}))

export default withDatabase(enhance(EditListCategoriesScreen))

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
  helpText: {
    padding: 20,
    fontSize: 20,
    color: '#000',
    marginTop: '5%',
  },
  addTop: {
    marginTop: 20,
    padding: 15,
    alignSelf: 'flex-end',
  },
})
