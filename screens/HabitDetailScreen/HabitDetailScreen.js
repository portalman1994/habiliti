import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Card, Colors, IconButton, ProgressBar, Text, Title } from 'react-native-paper';
import * as RootNavigation from '../../RootNavigation';
import { firebase } from '../../firebase/config';

export default function HabitDetailScreen(props) {
    const [progress, setProgress] = useState(0);
    const [length, setLength] = useState(0);

    const isFocused = useIsFocused();

    const habit = props.route.params;
    console.log(habit);
    
    const habitId = props.route.params.habit.id;
    const ref = firebase.firestore().collection('habits').doc(habitId);

    console.log(habitId);

    const fetchDates = async () => {
        const response = await ref.get().then(doc => {
            return doc.exists ? doc.data() : Promise.reject('no such data!')
        });
        
        const arrLength = response["dates"].length;
        setLength(arrLength);
        setProgress(arrLength / 66);
        
    }

    useEffect(() => {
        if (isFocused) {
            fetchDates();
        }
    }, [isFocused]);
    return (
        <View style={{flexDirection: 'column', flex: 1}}>
            <Card style={{margin: 20}}>
                <Card.Content>
                    <Title>{habit.habit.title}</Title> 
                </Card.Content>
                <Card.Actions style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 30, paddingBottom: 30}}>
                <IconButton 
                        icon='delete'
                        color='black'
                        size={30}
                        onPress={() => {RootNavigation.navigate('Home', ref.delete().then(() => {
                            console.log('Habit deleted successfully');
                        }).catch((error) => {
                            console.error('Error removing habit: ', error);
                        })
                        )}}
                    />
                </Card.Actions>
            </Card>
            <Card style={{margin: 20}}>
                <Card.Content>
                        <Title>Your Progress:</Title>
                        <ProgressBar style={{marginTop: 10}} progress={progress} color={Colors.blueA400} />
                        <Text>Keep it up!</Text>
                </Card.Content>
            </Card>
        </View>        
    );
}