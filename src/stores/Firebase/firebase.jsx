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
    addParole: (data) => { return new Promise() },
    editParole: (data) => { return new Promise() },
    doSignUpWithEmailAndPasswd: (data) => { return new Promise() },
    doSignInWithEmailAndPasswd: (data) => { return new Promise() },
    doSignInWithFacebook: () => { },
    doSignInWithGoogle: () => { },

})

function Firebase({ children }) {

    const [user] = useAuthState(auth())

    const doSignUpWithEmailAndPasswd = (data) => {
        return new Promise((resolve, reject) => {
            firestore().collection('utilisateurs')
                .where("utilsateur", "==", data.utilsateur).get()
                .then((usernames) => {
                    if (usernames.size === 0) {
                        auth().createUserWithEmailAndPassword(data.email, data.passwd)
                            .then((authUser) => {
                                return firestore().collection('utilisateurs')
                                    .doc(authUser.user.uid)
                                    .set({ ...data, passwd: '' })
                            })
                            .then(() => {
                                return auth().currentUser.sendEmailVerification({
                                    url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
                                })
                            })
                            .then(() => {
                                auth().currentUser.updateProfile({
                                    displayName: data.utilsateur,
                                })
                                resolve(auth().currentUser)
                            })
                            .catch(e => { reject(e) })
                    } else {
                        reject({ message: "Ce nom d'utilisateur est déjà utilisé!" })
                    }
                })
        })
    }

    const doSignInWithGoogle = () =>
        auth().signInWithPopup(new auth.GoogleAuthProvider())
            .then((authUser) => {
                console.log(authUser)
                firestore().collection('utilisateurs').doc(authUser.user.uid)
                    .set({
                        utilisateur: authUser.user.displayName,
                        avatar: authUser.user.photoURL,
                        email: authUser.user.email,
                        date_creation: authUser.user.metadata.creationTime,
                        prenom: authUser.additionalUserInfo.profile.given_name,
                        nom: authUser.additionalUserInfo.profile.family_name
                    })
            })

    const doSignInWithFacebook = () =>
        auth().signInWithPopup(new auth.FacebookAuthProvider())
            .then((authUser) => {
                firestore().collection('utilisateurs').doc(authUser.user.uid)
                    .set({
                        utilisateur: authUser.user.displayName,
                        avatar: authUser.user.photoURL+ "?type=large",
                        email: authUser.user.email,
                        date_creation: authUser.user.metadata.creationTime,
                        prenom: authUser.additionalUserInfo.profile.first_name,
                        nom: authUser.additionalUserInfo.profile.last_name
                    })
            })

    const doSignInWithEmailAndPasswd = (data) => {
        return new Promise((resolve, reject) => {
            auth().signInWithEmailAndPassword(data.email, data.passwd)
                .then((auth) => { resolve(auth) })
                .catch(e => { reject(e) })
        })
    }

    const addParole = (data) => {
        return new Promise((resolve, reject) => {
            firestore().collection('chansons').add({ ...data })
                .then(reference => {
                    resolve(reference)
                })
                .catch(e => { reject(e) })
        })
    }

    const editParole = (data) => {
        return new Promise((resolve, reject) => {
            const reference = firestore().doc(`paroles/${data.id}`)
            const user_ = user ? user.displayName : 'anonymous'
            firestore().runTransaction(async (tr) => {
                const doc = await tr.get(reference)
                const paroles = String(doc.data().paroles)
                const utilisateur = String(doc.data().ajout_par)
                tr.update(reference, {
                    paroles: data.edit,
                    editBy: user_,
                    date_edit: data.date_edit
                })
                firestore().collection(`notifications/${utilisateur}/chansons`).add({
                    paroles: [paroles, data.edit],
                    reference,
                    editee_par: user_
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
        user,
        addParole,
        editParole,
        doSignUpWithEmailAndPasswd,
        doSignInWithEmailAndPasswd,
        doSignInWithFacebook,
        doSignInWithGoogle
    }

    return (
        <FirebaseContext.Provider value={firebase}>
            {children}
        </FirebaseContext.Provider>
    )
}

export { Firebase, FirebaseContext }
