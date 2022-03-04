import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { navigate, navigationRef } from './RootNavigation';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome'
import { CalendarScreen, LoginScreen, HabitDetailScreen, HomeScreen, RegistrationScreen } from './screens';

import { firebase } from './firebase/config';
import { decode, encode } from 'base-64';
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Stack = createStackNavigator();

export default function App() {

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const usersRef = firebase.firestore().collection('users');
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data()
            setLoading(false)
            setUser(userData)
          })
          .catch((error) => {
            setLoading(false)
          });
      } else {
        setLoading(false)
      }
    });
  }, []);

  if (loading) {
    return (
      <></>
    )
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        { user ? (
          <>
          <Stack.Screen name='Home'>
            {props => <HomeScreen {...props} extraData={user} />}
          </Stack.Screen>
          <Stack.Screen name='HabitDetail' options={({ route }) => ({ title: route.params.habit.title, headerRight: () => <Icon name='calendar' size={30} color='black' style={{marginRight: 10}} onPress={() => navigate('Calendar', { habit: route.params.habit })} />})}>
            {props => <HabitDetailScreen {...props} extraData={user} options={{}} />}
          </Stack.Screen>
          <Stack.Screen name='Calendar'>
            {props => <CalendarScreen {...props} extraData={user} />}
          </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='Registration' component={RegistrationScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}