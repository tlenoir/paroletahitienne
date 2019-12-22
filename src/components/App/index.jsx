import 'bootstrap/dist/css/bootstrap.min.css'

import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import routes, { routesParams } from '../../constants/routes'
import { Firebase } from "../../stores/Firebase/index"
import { Themes } from "../../stores/Themes/index"
import Authentization from "../../stores/Authentication/index"
import { Container } from 'react-bootstrap'
import Navigation from "../Navigation/index"

export default function App() {
    return (
        <HashRouter basename='/'>
            <Themes>
                <Firebase>
                    <Navigation />
                    <Container>
                        <Authentization>
                            <Switch>
                                {routes.map(route => <Route key={route.path} {...route} />)}
                                {routesParams.map(route => <Route key={route.path} {...route} />)}
                            </Switch>
                        </Authentization>
                    </Container>
                </Firebase>
            </Themes>
        </HashRouter>
    )
}
