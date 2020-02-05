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
    addParole: (data) => { },
    editParole: (data, id) => { },
    addFavoris: (ref) => { },
    removeFavoris: (ref) => { },
    doSignUpWithEmailAndPasswd: (data) => { },
    doSignInWithEmailAndPasswd: (data) => { },
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

    const doSignInWithGoogle = async () => {
        const authUser = await auth().signInWithPopup(new auth.GoogleAuthProvider())
        firestore().collection('utilisateurs').doc(authUser.user.uid)
            .set({
                utilisateur: authUser.user.displayName,
                avatar: authUser.user.photoURL,
                email: authUser.user.email,
                date_creation: authUser.user.metadata.creationTime,
                prenom: authUser.additionalUserInfo.profile.given_name,
                nom: authUser.additionalUserInfo.profile.family_name
            })
    }

    const doSignInWithFacebook = async () => {
        const authUser = await auth().signInWithPopup(new auth.FacebookAuthProvider())
        firestore().collection('utilisateurs').doc(authUser.user.uid)
            .set({
                utilisateur: authUser.user.displayName,
                avatar: authUser.user.photoURL + "?type=large",
                email: authUser.user.email,
                date_creation: authUser.user.metadata.creationTime,
                prenom: authUser.additionalUserInfo.profile.first_name,
                nom: authUser.additionalUserInfo.profile.last_name
            })
    }

    const doSignInWithEmailAndPasswd = (data) => {
        return auth().signInWithEmailAndPassword(data.email, data.passwd)
    }

    const addParole = async (data) => {
        const index = combineArray(data)
        await firestore().collection('chansons').add({
            ...data,
            index
        })
            .then(() => {
                searchArtistOrGroup(data)
            })
    }

    const editParole = (data, id) => {
        const reference = firestore().doc(`chansons/${id}`)
        const user_ = user ? user.displayName : 'anonymous'
        const uid = user ? user.uid : 'anonymous'
        const index = combineArray(data)
        searchArtistOrGroup(data)

        return firestore().runTransaction(async (tr) => {
            const doc = await tr.get(reference)
            const paroles = String(doc.data().paroles)
            tr.update(reference, {
                ...data,
                index,
                edit_par: user_,
            })
            return firestore().collection(`notifications/${uid}/chansons`).add({
                paroles2: data.paroles,
                paroles1: paroles,
                reference,
                editee_par: user_
            })
        })
    }

    const addFavoris = (ref) => {
        return firestore().doc(ref).update({ favoris: firestore.FieldValue.arrayUnion(user.uid) })
    }

    const removeFavoris = (ref) => {
        return firestore().doc(ref).update({ favoris: firestore.FieldValue.arrayRemove(user.uid) })
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
        addFavoris,
        removeFavoris,
        doSignUpWithEmailAndPasswd,
        doSignInWithEmailAndPasswd,
        doSignInWithFacebook,
        doSignInWithGoogle
    }

    const combineArray = (data) => {
        const lowerCase = data.paroles.toLowerCase().replace(/(\[).+?(\])/g, "").replace(/(\{).+?(\})/g, "").replace(/(\|).+?(\|)/g, "").replace(/\r?\n/g, " ").split(' ');
        const upperCase = data.paroles.toUpperCase().replace(/(\[).+?(\])/g, "").replace(/(\{).+?(\})/g, "").replace(/(\|).+?(\|)/g, "").replace(/\r?\n/g, " ").split(' ');
        const capitalize = data.paroles.replace(/\b\w/g, l => l.toUpperCase()).replace(/(\[).+?(\])/g, "").replace(/(\{).+?(\})/g, "").replace(/(\|).+?(\|)/g, "").replace(/\r?\n/g, " ").split(' ');
        const paroleIndex = data.paroles.replace(/(\[).+?(\])/g, "").replace(/(\{).+?(\})/g, "").replace(/(\|).+?(\|)/g, "").replace(/\r?\n/g, " ").split(' ');
        const array = [].concat(paroleIndex, lowerCase,
            upperCase, capitalize, data.artistes, data.groupes, data.titre);
        const uniqueSet = new Set(array);
        return [...uniqueSet];
    }

    const searchArtistOrGroup = (data) => {
        if (data.artistes[0] !== 'Inconnu')
            firestore().collection('artistes').where('nom', 'in', data.artistes).get()
                .then((docs) => {
                    if (docs.empty) {
                        data.artistes.forEach(element => {
                            firestore().collection('artistes').add({
                                nom: element
                            })
                        })
                    }
                    else {
                        data.artistes.forEach(element => {
                            if (!docs.docs.find(element_ => element_.data().nom === element))
                                firestore().collection('artistes').add({
                                    nom: element
                                })
                        })
                    }
                })
        if (data.groupes[0] !== 'Inconnu')
            firestore().collection('groupes').where('nom', 'in', data.groupes).get()
                .then((docs) => {
                    if (docs.empty) {
                        data.groupes.forEach(element => {
                            firestore().collection('groupes').add({
                                nom: element
                            })
                        })
                    }
                    else {
                        data.groupes.forEach(element => {
                            if (!docs.docs.find(element_ => element_.data().nom === element))
                                firestore().collection('groupes').add({
                                    nom: element
                                })
                        })
                    }
                })
    }

    return (
        <FirebaseContext.Provider value={firebase}>
            {children}
        </FirebaseContext.Provider>
    )
}

export { Firebase, FirebaseContext }
