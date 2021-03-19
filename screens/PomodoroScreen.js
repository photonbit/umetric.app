import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ProgressCircle } from 'react-native-svg-charts'
import { Feather } from '@expo/vector-icons'
import { Audio } from 'expo-av'

import Icon from '../components/Icon'

export default function PomodoroScreen ({ route }) {
  const [progress, setProgress] = useState(1.0)
  const [state, setState] = useState('play')
  const [progressTimer, setProgressTimer] = useState()
  const [sound, setSound] = useState()

  const minutes = 25
  const seconds = minutes * 60
  const [timeLeft, setTimeLeft] = useState(seconds)
  const category = route.params.category

  async function playSound () {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/ring.wav')
    )
    setSound(sound)

    await sound.playAsync()
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync()
        }
      : undefined
  }, [sound])

  useEffect(() => {
    if (state !== 'square') return

    setProgress(timeLeft / seconds)
    if (!timeLeft) {
      resetTimer('play')
      playSound()
    } else {
      setProgressTimer(setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000))
    }

    return () => { clearTimeout(progressTimer) }
  }, [timeLeft, state])

  const resetTimer = (newState) => {
    if (progressTimer) {
      clearTimeout(progressTimer)
      setProgressTimer(undefined)
    }
    setState(newState)
    setProgress(1.0)
    setTimeLeft(seconds)
  }
  const onPress = () => {
    if (state === 'play') {
      resetTimer('square')
    } else {
      resetTimer('play')
    }
  }

  const focusMessage = () => {
    if (state === 'square') {
      return (
                <View>
                    <Text style={styles.focusText}>Céntrate en {category.name}</Text>
                </View>
      )
    }
  }

  return (
    <View style={styles.container} >
        <View style={styles.progressArea}>
          <ProgressCircle
              style={styles.progress}
              progress={progress}
              progressColor={'rgb(134, 65, 244)'}
              strokeWidth={10} />
          <View style={styles.progressIcon}>
              <Icon style={styles.icon} icon={category.icon} />
          </View>
      </View>
      <View style={styles.playArea}>
          <TouchableOpacity onPress={onPress} >
              <Feather name={state} size={64} color="black" />
          </TouchableOpacity>
      </View>
      {focusMessage()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  progress: {
    height: 280,
    width: '90%'
  },
  progressArea: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '60%'
  },
  progressIcon: {
    width: 200,
    height: 200,
    position: 'absolute'
  },
  focusText: {
    marginTop: 50,
    fontSize: 24,
    fontWeight: 'bold'
  },
  playArea: {
    marginTop: 30
  }
})
