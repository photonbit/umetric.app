import React, { useEffect, useLayoutEffect } from 'react'
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Feather } from '@expo/vector-icons'

import EditableElement from '../components/EditableElement'
import * as RootNavigation from '../navigation/RootNavigation'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import { deleteCategory, getCategories } from '../services/UmetricAPI'

export default function EditListCategoriesScreen ({ navigation }) {

  const { data, error, isError, isLoading } = useQuery('categories', getCategories)
  if (isLoading) {
    return <View><Text>Loading...</Text></View>
  }
  if (isError) {
    return <View><Text>Something is wrong: {error.message}...</Text></View>
  }

  const mutation = useMutation(
    (categoryId) => deleteCategory({ categoryId }))
  const { isSuccess } = mutation
  const queryClient = useQueryClient()

  const onNamePress = (item) => RootNavigation.navigate('ListEditEvents', { category_id: item.id })
  const onEditPress = (item) => RootNavigation.navigate('EditCategory', { category_id: item.id })
  const onDeletePress = (item) => Alert.alert(
    'Borrar ' + item.name + '?',
    'Que la vas a borrar',
    [
      {
        text: 'Vale, no',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      },
      { text: 'Sí', onPress: () => mutation.mutate(item.id) }
    ],
    { cancelable: false }
  )

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
    if (isSuccess) {
      queryClient.invalidateQueries('categories').then(() =>
        RootNavigation.navigate('ListEditCategories')
      )
    }
  }, [isSuccess])

  const renderItem = ({ item }) => (
    <EditableElement
    element={item}
    onNamePress={() => onNamePress(item)}
    onEditPress={() => onEditPress(item)}
    onDeletePress={() => onDeletePress(item)} />
  )
  return (
          <FlatList
      style={styles.flatlist}
      data={data}
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
