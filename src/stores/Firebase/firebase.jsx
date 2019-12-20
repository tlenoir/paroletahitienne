import React from 'react'
import { firestore, database, storage, auth, initializeApp } from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/storage'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
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
initializeApp(firebaseConfig)
/* ##### */

const FirebaseContext = React.createContext({
    storage,
    auth,
    database,
    firestore,
    useDocument,
    useCollection,
    user: auth().currentUser,
    addParole: (data) => { return new Promise() }
})

function Firebase({ children }) {

    const [user] = useAuthState(auth())

    const addParole = (data) => {
        return new Promise((resolve, reject) => {
            firestore().collection('chansons').add({ ...data })
                .then(reference => {
                    firestore()
                        .collection(user ? `utilisateurs/${user.uid}/chansons` : 'utilisateurs/anonymous/chansons')
                        .add({ reference })
                    resolve(reference)
                })
                .catch(e => { reject(e) })
        })
    }


    const firebase = {
        storage,
        auth,
        database,
        firestore,
        useDocument,
        useCollection,
        user,
        addParole
    }

    return (
        <FirebaseContext.Provider value={firebase}>
            {children}
        </FirebaseContext.Provider>
    )
}

export { Firebase, FirebaseContext }
