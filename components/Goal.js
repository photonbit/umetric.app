import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import Icon from '../components/Icon';

export default function Goal({ category, committed, done }) {

    const DoneSquare = (key) => {
        return (<View style={styles.done} key ></View>);
    };

    const NotDoneSquare = (key) => {
        return (<View style={styles.notDone} key></View>);
    };

    const OverdoneSquare = (key) => {
        return (<View style={styles.overDone} key></View>);
    }

    const drawGoal = () => {
        var squares = [];

        if (committed > done ) {
            for (i=done;i<committed;i++) {
                squares.push(<NotDoneSquare key={i} />);
            }
            for (i=0;i<done;i++) {
                squares.push(<DoneSquare key={i} />);
            }
        } else {
            for (i=committed;i<done;i++) {
                squares.push(<OverdoneSquare key={i} />);
            }
            for (i=0;i<committed;i++) {
                squares.push(<DoneSquare key={i} />);
            }
        }
        return squares;
    }

	return (
	    <View style={styles.container}>
	        {drawGoal()}
	        <View style={styles.icon}>
	            <Icon icon={category.icon} />
	        </View>
	    </View>
	);
}

const styles = StyleSheet.create({
    container: {
        width: 50,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    done: {
        backgroundColor: '#48BBEC',
        width: 40,
        height: 40,
        padding: 1,
        margin: 5
    },
    notDone: {
        borderColor: '#48BBEC',
        borderWidth: 4,
        width: 40,
        height: 40,
        padding: 1,
        margin: 5
    },
    overDone: {
        backgroundColor: '#2093C4',
        width: 40,
        height: 40,
        padding: 1,
        margin: 5
    },
    icon: {
        width: 50,
        height: 50,
        margin: 5,
        padding: 1
    }
});
