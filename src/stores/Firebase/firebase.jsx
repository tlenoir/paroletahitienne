import React from 'react'
import { firestore, database, storage, auth, initializeApp } from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/storage'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import moment from 'moment'
import 'moment/locale/fr'

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
    useAuthState,
    addParole: (data) => { return new Promise },
    addFavori: (reference) => { },
    deleteFavori: (reference) => { },
    editParole: (reference, data) => { },
    singUp: (data) => { }
})

function Firebase({ children }) {
    const [user] = useAuthState(auth())

    const singUp = (data) => {
        return new Promise((res, rej) => {
            firestore().collection('utilisateurs').where("utilsateur", "==", data.utilsateur).get()
                .then((data) => {
                    if (data.size === 0) {
                        auth()
                            .createUserWithEmailAndPassword(data.email, data.passwd)
                            .then(authUser => {
                                data.passwd = undefined
                                return firestore().collection('utilisateurs')
                                    .doc(authUser.user.uid)
                                    .set({
                                        ...data,
                                        date_creation: firestore.Timestamp.fromDate(new Date()),
                                        date_naissance: moment(data.date_naissance).local('fr').format("LL")
                                    })
                            })
                            .then(() => {
                                return auth().currentUser.sendEmailVerification({
                                    url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
                                })
                            })
                            .then(() => {
                                return auth().currentUser.updateProfile({
                                    displayName: data.utilsateur,
                                });
                            })
                            .then(() => {
                                res(true)
                            })
                            .catch(e =>
                                rej(e)
                            );
                    }
                    else {
                        rej('username/exists')
                    }
                })
        })
    }

    const addParole = (data) => {
        console.log('method addparole', data)
        return new Promise((res, rej) => {
            firestore().collection('chansons').add({
                ...data
            })
                .then((reference) => {
                    firestore()
                        .collection(user ? `utilisateurs/${user.uid}/chansons` : 'utilisateurs/anonymous/chansons')
                        .add({ reference })
                    res(reference)
                })
                .catch(e => rej(e))
        })
    }

    const addFavori = (reference) => {
        return new Promise((res, rej) => {
            firestore().collection(`utilisateurs/${user.uid}/favoris`).add({
                reference
            })
                .then(reference => res(reference))
                .catch(e => rej(e))
        })
    }

    const deleteFavori = (reference) => {
        firestore().doc(reference).delete()
    }

    const editParole = (reference, data) => {
        firestore().runTransaction((tr) => {
            return tr.get(reference)
                .then(doc => {
                    const parole = String(doc.data().parole)
                    const uid = String(doc.data().uid)
                    tr.update(reference, {
                        parole: data,
                        editBy: user ? user.displayName : 'anonymous'
                    })
                    return { parole, uid }
                }).then(({ parole, uid }) => {
                    if (user)
                        firestore().collection('notifications').doc(uid)
                            .collection("chansons").add({
                                parole: [parole, data],
                                editBy: user ? user.displayName : 'anonymous'
                            })
                })
        })
    }

    const firebase = {
        storage,
        auth,
        database,
        firestore,
        useDocument,
        useCollection,
        useAuthState,
        addParole,
        addFavori,
        deleteFavori,
        editParole,
        singUp
    }
    return (
        <FirebaseContext.Provider value={firebase}>
            {children}
        </FirebaseContext.Provider>
    )
}

export { Firebase, FirebaseContext }
