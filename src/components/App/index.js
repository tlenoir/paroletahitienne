import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react'
import firebase from 'firebase/app';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Navigation from "../Navigation";
import Home from "../Home"
import Liste from "../Liste"

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

function App() {
    return (
        <BrowserRouter>
        <Navigation />
            <Switch>
                <div className="container">
                    <Route exact path="/" component={Home} />
                    <Route exact path="/liste" component={Liste} />
                </div>
            </Switch>
        </BrowserRouter>
    )
};

export default App
