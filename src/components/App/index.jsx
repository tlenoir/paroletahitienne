import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Firebase } from "../Firebase/index"
import Navigation from "../Navigation/index";
import Home from "../Home/index"
import Liste from "../Liste/index"
import Parole from "../Parole/index"
import Profile from "../Profile/index"

function App() {
    return (
        <BrowserRouter>
            <Firebase>
                <Navigation />
                <div className="container">
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/liste" component={Liste} />
                        <Route exact path="/liste=:id" component={Parole} />
                        <Route exact path="/profile" component={Profile} />
                    </Switch>
                </div>
            </Firebase>
        </BrowserRouter>
    )
};

export default App
