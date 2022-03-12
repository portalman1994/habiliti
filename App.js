import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { navigate, navigationRef } from './RootNavigation';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome'
import { LoginScreen, HabitDetailScreen, HomeScreen, RegistrationScreen, SettingsScreen } from './screens';
import { LogBox } from 'react-native';
import { firebase } from './firebase/config';
import { decode, encode } from 'base-64';
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Stack = createStackNavigator();

export default function App() {
  LogBox.ignoreAllLogs()

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
          <Stack.Screen name='Home' options={({ route }) => ({ title: 'Settings', headerRight: () => <Icon name='gear' size={30} color='black' style={{ marginRight: 20 }} onPress={() => navigate('Settings', {user: user})} /> })}>
            {props => <HomeScreen {...props} extraData={user} />}
          </Stack.Screen>
          <Stack.Screen name='HabitDetail' options={({ route }) => ({ title: route.params.habit.title, headerRight: () => <Icon name='trash' size={30} color='black' style={{marginRight: 20}} onPress={() => navigate('Home', firebase.firestore().collection('habits').doc(route.params.habit.id).delete().then(() => {
                            console.log('Habit deleted successfully');
                        }).catch((error) => {
                            console.error('Error removing habit: ', error);
                        }))} />})}>
            {props => <HabitDetailScreen {...props} extraData={user} options={{}} />}
          </Stack.Screen>
          <Stack.Screen name='Settings'>
            {props => <SettingsScreen {...props} extraData={user} />}
          </Stack.Screen>
          <Stack.Screen name='Login' component={LoginScreen}/>
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