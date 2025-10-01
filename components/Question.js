import React, { useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import i18n from 'i18n-js'

const QuestionComponent = ({ question, likertScales, onSubmit }) => {
  const [selectedValues, setSelectedValues] = useState(
    likertScales.reduce((acc, curr) => ({ ...acc, [curr.id]: null }), {}),
  )

  const handleChange = (scaleId, value) => {
    setSelectedValues({ ...selectedValues, [scaleId]: value + 1 })
  }

  const handleSubmit = () => {
    const adjustedValues = Object.entries(selectedValues).reduce((acc, [scaleId, value]) => {
      const scale = likertScales.find((s) => s.id === parseInt(scaleId))
      const adjustedValue = value * scale.slope + scale.intercept
      return { ...acc, [scaleId]: adjustedValue }
    }, {})
    onSubmit(question.id, adjustedValues)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question.text}</Text>
      {likertScales.map((scale) => (
        <View key={scale.id} style={styles.scale}>
          <Text style={styles.description}>{scale.description}</Text>
          <View style={styles.scaleLabels}>
            <Text style={styles.lowerLabel}>{scale.lowerChoiceLabel}</Text>
            <Text style={styles.middleLabel}>{scale.middleChoiceLabel}</Text>
            <Text style={styles.upperLabel}>{scale.upperChoiceLabel}</Text>
          </View>
          <SegmentedControl
            style={styles.scaleChooser}
            values={[...Array(scale.choices).keys()].map((_, index) => `${index + 1}`)}
            selectedIndex={selectedValues[scale.id] - 1}
            onChange={(event) => handleChange(scale.id, event.nativeEvent.selectedSegmentIndex)}
          />
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={handleSubmit} underlayColor="#99d9f4">
        <Text style={styles.buttonText}>{i18n.t('save')}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 20,
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingVertical: 20,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scale: {
    marginVertical: 20,
  },
  lowerLabel: {
    textAlign: 'left',
    paddingLeft: 5,
  },
  upperLabel: {
    textAlign: 'right',
    paddingRight: 5,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  middleLabel: {
    position: 'absolute',
    left: '45%',
    justifyContent: 'center',
    textAlign: 'right',
  },
  scaleChooser: {
    height: 44,
    marginTop: 12,
    marginBottom: 16,
    paddingHorizontal: 4,
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 40,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  },
})

export default QuestionComponent
