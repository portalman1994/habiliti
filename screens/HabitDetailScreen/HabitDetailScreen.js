import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Card, Colors, IconButton, ProgressBar, Text, Title } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import * as RootNavigation from '../../RootNavigation';
import { firebase } from '../../firebase/config';

export default function HabitDetailScreen(props) {
    const [progress, setProgress] = useState(0);
    const [date, setDate] = useState('');
    const [dates, setDates] = useState({});
    const isFocused = useIsFocused();

    const habit = props.route.params;
    console.log(habit);
    
    const habitId = props.route.params.habit.id;
    const ref = firebase.firestore().collection('habits').doc(habitId);

    console.log(habitId);

    const handleClick = async (selectedDate) => {
        const response = await ref.get().then(doc => {
            return doc.exists ? doc.data() : Promise.reject('no such data!') 
        });

        const newDate = selectedDate["dateString"].toString();
        const currentDates = response["dates"];

        if (currentDates.indexOf(newDate) === -1 || currentDates === null) {
            setDate(newDate);
            ref.update({
                dates: firebase.firestore.FieldValue.arrayUnion(newDate)
            });
            console.log('Adding selected date...', newDate);
        } else if (currentDates.indexOf(newDate) > -1) {
            setDate(`${newDate}-REMOVE`);
            ref.update({
                dates: firebase.firestore.FieldValue.arrayRemove(newDate)
            });
            console.log('Removing selected date...', newDate);
        }
    }

    const fetchDates = async () => {
        const response = await ref.get().then(doc => {
            return doc.exists ? doc.data() : Promise.reject('no such data!')
        });
        
        const arrLength = response["dates"].length;
        setProgress(arrLength / 66);

        const datesObj = response["dates"].reduce((obj, cur) => ({...obj, [cur]: { selected: true, marked: true}}), {});
        setDates(datesObj);
    }

    useEffect(() => {
        if (isFocused) {
            fetchDates();
        }
    }, [isFocused, date]);
    return (
        <View style={{flexDirection: 'column', flex: 1}}>
            <Card style={{margin: 20}}>
                <Card.Content>
                    <Title>{habit.habit.title}</Title> 
                </Card.Content>
                <Card.Actions style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 30, paddingBottom: 30}}>
                </Card.Actions>
            </Card>
            <Card style={{margin: 20}}>
                <Card.Content>
                        <Title>Your Progress:</Title>
                        <ProgressBar style={{marginTop: 10}} progress={progress} color={Colors.blueA400} />
                        <Text>Keep it up!</Text>
                </Card.Content>
            </Card>
            <View style={{margin: 20}}>
                <Calendar markedDates={dates} onDayPress={(selectedDate) => handleClick(selectedDate)} />
            </View>
        </View>        
    );
}