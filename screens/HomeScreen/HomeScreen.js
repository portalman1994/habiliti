import React, { useEffect, useState } from 'react';
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Card, Title } from 'react-native-paper';
import * as RootNavigation from '../../RootNavigation';
import styles from './styles';
import { firebase } from '../../firebase/config';

export default function HomeScreen(props) {

    const [habitTitle, setHabitTitle] = useState('');
    const [habits, setHabits] = useState([]);

    const habitRef = firebase.firestore().collection('habits')
    const userID = props.extraData.id;

    useEffect(() => {
        habitRef
            .where('authorID', '==', userID)
            .orderBy('createdAt', 'desc')
            .onSnapshot(
                querySnapshot => {
                    const newHabits = []
                    querySnapshot.forEach(doc => {
                        const habit = doc.data()
                        habit.id = doc.id
                        newHabits.push(habit)
                    });
                    setHabits(newHabits)
                },
                error => {
                    console.log(error)
                }
            )
    }, [])

    const onAddButtonPress = () => {
        if (habitTitle && habitTitle.length > 0) {
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            const data = {
                title: habitTitle,
                authorID: userID,
                createdAt: timestamp,
                dates: []
            };
            habitRef
                .add(data)
                .then(_doc => {
                    setHabitTitle('')
                    Keyboard.dismiss()
                })
                .catch((error) => {
                    alert(error)
                });
        }
    }

    const renderHabit = ({item, index}) => {
        return (
            <TouchableOpacity onPress={() => RootNavigation.navigate('HabitDetail', { habit: item })}>
            <View style={styles.habitContainer}>
                <Card>
                    <Card.Content>
                        <Title>{item.title}</Title>
                    </Card.Content>
                </Card>
            </View>
            </TouchableOpacity>
        );
    }
    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Add New Habit'
                    placeholderTextColor='#aaaaaa'
                    onChangeText={(text) => setHabitTitle(text)}
                    value={habitTitle}
                    underlineColorAndroid='transparent'
                    autoCapitalize='none'
                />
                <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
            </View>
            { habits && (
                <View style={styles.listContainer}> 
                    <FlatList
                        data={habits}
                        renderItem={renderHabit}
                        keyExtractor={(item) => item.id}
                        removeClippedSubviews={true}
                        horizontal={false}
                        numColumns={2}
                    />
                </View>
            )}
        </View>
    );
}