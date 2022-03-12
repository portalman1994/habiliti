import React, { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Avatar, Divider, Text } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import * as RootNavigation from '../../RootNavigation';
import { firebase } from '../../firebase/config';

export default function SettingsScreen(props) {

    const fullName = props.route.params.user.fullName;
    const email = props.route.params.user.email;
    const userName = fullName.split(' ').map(word => word[0]).join('');
    
    const signOut = async () => {
        await firebase.auth().signOut();
        RootNavigation.navigate('Login');
    }

    return (
        <View style={{flexDirection: 'column'}}>
            <View style={{flexDirection: 'row', borderBottomColor: 'lightgray', borderBottomWidth: 2}}>
            <Avatar.Text size={60} style={{margin: 20, flexDirection: 'row'}} label={userName} />
            <View style={{flexDirection: 'column', marginTop: 25}}>
                <Text style={{flexDirection: 'row', fontSize: 25}}>{fullName}</Text>
                <Text style={{flexDirection: 'row'}}>{email}</Text>
            </View>
            </View>
            <View style={{flexDirection: 'row', backgroundColor: 'lightgray', padding: 50 }}>
            </View>
            <View style={{flexDirection: 'row', borderBottomColor: 'lightgray', borderBottomWidth: 2}}>
                <TouchableOpacity style={{margin: 25}} onPress={()=> signOut()}>
                    <Text style={{fontSize: 20}}>Sign out </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

}