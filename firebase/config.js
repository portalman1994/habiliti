import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { firebaseKey } from '../config';

const firebaseConfig = {
    apiKey: firebaseKey.apiKey,
    authDomain: firebaseKey.authDomain,
    projectId: firebaseKey.projectId,
    storageBucket: firebaseKey.storageBucket,
    messagingSenderId: firebaseKey.messagingSenderId,
    appId: firebaseKey.appId
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };
