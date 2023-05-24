import React, { useEffect, useLayoutEffect } from 'react'
import {ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import { Feather } from '@expo/vector-icons'
import i18n from 'i18n-js'

import EditableElement from '../components/EditableElement'
import * as RootNavigation from '../navigation/RootNavigation'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import UmetricAPI from '../services/UmetricAPI'

export default function EditListCategoriesScreen ({ navigation }) {

  const { getCategories, deleteCategory, updateCategories } = UmetricAPI()
  const { data, error, isError, isLoading } = useQuery('categories', getCategories)
  if (isLoading) {
    return <View><ActivityIndicator size="large" /></View>
  }
  if (isError) {
    return <View><Text>Something is wrong: {error.message}...</Text></View>
  }

  const deleteMutation = useMutation(
    (categoryId) => deleteCategory({ categoryId }))
  const orderMutation = useMutation(
      (categories) => updateCategories({categories})
  )
  const isDeleteSuccess = deleteMutation.isSuccess
  const isOrderSuccess = orderMutation.isSuccess
  const queryClient = useQueryClient()

  const onNamePress = (item) => RootNavigation.navigate('ListEditEvents', { category_id: item.id })
  const onEditPress = (item) => RootNavigation.navigate('EditCategory', { category_id: item.id })
  const onDeletePress = (item) => Alert.alert(
      i18n.t('delete') + ' ' + item.name + '?',
      i18n.t('confirmDelete'),
    [
      {
        text: i18n.t('okNo'),
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      },
      { text: i18n.t('yes'), onPress: () => mutation.mutate(item.id) }
    ],
    { cancelable: false }
  )

  const onUpPress = (item) => {
    const index = data.findIndex(e => e.id === item.id)
    if (index > 0) {
      const oldPrev = data[index - 1]
      const itemOrder = { "id": item.id, "order": oldPrev.order}
      const oldPrevOrder = { "id": oldPrev.id, "order": item.order}

      orderMutation.mutate([itemOrder, oldPrevOrder])
    }
  }

  const onDownPress = (item) => {
    const index = data.findIndex(e => e.id === item.id)
    if (index < data.length - 1) {
      const oldNext = data[index + 1]
      const itemOrder = { "id": item.id, "order": oldNext.order}
      const oldNextOrder = { "id": oldNext.id, "order": item.order}

      orderMutation.mutate([itemOrder, oldNextOrder])
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
            <TouchableOpacity style={styles.actionIcon} onPress={() => RootNavigation.navigate('AddCategory')}>
                <Feather name="folder-plus" size={30} color="black" />
            </TouchableOpacity>
      )
    })
  }, [])

  useEffect(() => {
    if (isDeleteSuccess || isOrderSuccess) {
      queryClient.invalidateQueries('categories').then(() =>
        RootNavigation.navigate('ListEditCategories')
      )
    }
  }, [isDeleteSuccess, isOrderSuccess])

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
      data={data.sort((a, b) => a.order - b.order)}
      renderItem={renderItem}
      keyExtractor={item => ""+item.id}
    />
  )
}

EditListCategoriesScreen.displayName = 'EditListCategoriesScreen'

const styles = StyleSheet.create({
  flatlist: {
    flex: 1
  },
  actionIcon: {
    padding: 5,
    marginTop: 5,
    marginRight: 10
  }
})
