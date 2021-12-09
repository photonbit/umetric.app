import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

import IconSelector from '../components/IconSelector'
import Icon from '../components/Icon'
import * as RootNavigation from '../navigation/RootNavigation'
import {useMutation, useQuery, useQueryClient} from "react-query";
import {editCategory, getCategory} from "../services/UmetricAPI";

export default function EditCategoryScreen ({ route }) {
  const categoryId = route.params.category_id
  const { data, error, isError, isLoading } = useQuery(['category', categoryId],
      ({queryKey}) => {
        return getCategory({queryKey}).then((cat)=> {
        setName(cat.name)
        setIcon(cat.icon)
        return cat
      })
  })
  const mutation = useMutation(
      (modifiedCategory) => editCategory({categoryId, modifiedCategory}))
  const { isSuccess } = mutation
  const queryClient = useQueryClient()

  const [modalVisible, setModalVisible] = useState(false)
  const [icon, setIcon] = useState("")
  const [name, setName] = useState("")

  const saveCategory = () => {
    mutation.mutate({
      name: name,
      icon: icon
    })
  }

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries('category', categoryId).then(()=>
          queryClient.invalidateQueries('categories').then(()=>
        RootNavigation.navigate('ListEditCategories')
      ))
    }

   }, [isSuccess]);

  if (isLoading) {
    return <View><Text>Loading...</Text></View>
  }
  if (isError) {
    return <View><Text>Something is wrong: {error.message}...</Text></View>
  }

  return (
    <View style={styles.container}>
        <IconSelector
            visible={modalVisible}
            setVisible={setModalVisible}
            selected={icon}
            setIcon={setIcon}
        />

        <Text style={styles.title}>Nombre</Text>
        <TextInput onChangeText={setName} defaultValue={data.name} style={styles.input} />
        <Text style={styles.title}>Icono</Text>
      <TouchableOpacity
          style={styles.icon}
          onPress={() => {
            setModalVisible(true)
          }} >
        <Icon icon={icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={saveCategory} underlayColor='#99d9f4'>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  icon: {
    height: 90,
    width: 90,
    padding: 10
  },
  container: {
    justifyContent: 'center',
    padding: 20
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  input: {
    fontSize: 18,
    width: '100%',
    borderColor: '#CCCCCC',
    backgroundColor: '#FAFAFA',
    color: '#111111',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 10,
    marginTop: 5
  }
})
