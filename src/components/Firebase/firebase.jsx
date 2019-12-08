import React from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/storage'
import { useAuthState } from 'react-firebase-hooks/auth';

/* ##### */
const firebaseConfig = {
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    databaseURL: process.env.REACT_APP_databaseURL,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId,
    measurementId: process.env.REACT_APP_measurementId
};
firebase.initializeApp(firebaseConfig)
/* ##### */

const FirebaseContext = React.createContext({
    user: {
        uid: "",
        displayName: "",
        email: "",
        emailVerified: Boolean,
        metadata: {
            creationTime: "",
            lastSignInTime: ""
        },
        photoURL: "",
        phoneNumber: "",
    }
})

function Firebase({ children }) {
    const [user] = useAuthState(firebase.auth())
    return (
        <FirebaseContext.Provider value={user}>
            {children}
        </FirebaseContext.Provider>
    )
}

export { Firebase, FirebaseContext }
