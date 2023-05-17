import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { QuestionnaireService } from '../services/UmetricAPI'

export default function ListQuestionnairesScreen({ navigation }) {
  const [questionnaires, setQuestionnaires] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await QuestionnaireService.getQuestionnaires();
      setQuestionnaires(data);
    };

    fetchData();
  }, []);

  const Item = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Questionnaire', { questionnaire_id: item.id })}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.shortName}>{item.short_name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.source}>Source: {item.source}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatlist}
        data={questionnaires}
        keyExtractor={(item) => item.id.toString()}
        renderItem={Item}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'center'
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
});
