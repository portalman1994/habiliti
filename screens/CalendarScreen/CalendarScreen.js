import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { firebase } from '../../firebase/config';

export default function CalendarScreen(props) {
    const [updateDates, setUpdateDates] = useState({});
    const [date, setDate] = useState('');

    const habitId = props.route.params.habit.id;
    const ref = firebase.firestore().collection('habits').doc(habitId);

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

    useEffect(() => {
        async function fetchDates() {
            const response = await ref.get().then(doc => {
                return doc.exists ? doc.data() : Promise.reject('no such data!')
            });

            const datesObj = response["dates"].reduce((obj, cur) => ({...obj, [cur]: { selected: true, marked: true}}), {});

            setUpdateDates(datesObj);
        }
        fetchDates();
    }, [date]);



    console.log('current state of', updateDates);
    //console.log(habit);
    return (
        <View>
            <Calendar markedDates={updateDates} onDayPress={(selectedDate) => handleClick(selectedDate)} />
        </View>
    );
}