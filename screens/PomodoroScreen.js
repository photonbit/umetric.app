import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts';
import { Feather } from '@expo/vector-icons';
import { Audio } from 'expo-av';

import Icon from '../components/Icon';

export default function PomodoroScreen({ route }) {
    const [ progress, setProgress ] = useState(1.0);
    const [ state, setState ] = useState("play");
    const [ progressTimer, setProgressTimer ] = useState();

    const [timeLeft, setTimeLeft] = useState(10);

    const minutes = 25;
    const category = route.params.category;

    const [sound, setSound] = useState();

    async function playSound() {
        const { sound } = await Audio.Sound.createAsync(
           require('../assets/ring.wav')
        );
        setSound(sound);

        await sound.playAsync();
    }

    useEffect(() => {
        if (state != "square") return;

        clearInterval(progressTimer);
        setProgressTimer(setInterval(() => {
          setTimeLeft(timeLeft - 1);
          setProgress(timeLeft / 10);

          if (!timeLeft) {
            clearInterval(progressTimer);
            setState("play");
            playSound();
          }
        }, 1000));

        return () => { clearInterval(progressTimer); if (sound) { sound.unloadAsync(); }};
    }, [timeLeft, sound]);

    const onPress = () => {
        if (state == "play") {
            setTimeLeft(10);
            setProgress(1.0);
            setState("square");
        } else {
            clearInterval(progressTimer);
            setTimeLeft(10);
            setProgress(1.0);
            setState("play");
        }
    };

	return (
		<View style={styles.container} >
		    <View style={styles.progressArea}>
			    <ProgressCircle style={styles.progress} progress={progress} progressColor={'rgb(134, 65, 244)'} />
			    <View style={styles.progressIcon}>
			        <Icon style={styles.icon} icon={category.icon} />
			    </View>
			</View>
			<View style={styles.playArea}>
			    <TouchableOpacity onPress={onPress} >
			        <Feather name={state} size={48} color="black" />
			    </TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    progress: {
        height: 200,
        width: '80%'
    },
    progressArea: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        height: '40%'
    },
    progressIcon: {
        width: 140,
        height: 140,
        position: 'absolute'
    },
    playArea: {
    },
});
