import 'bootstrap/dist/css/bootstrap.min.css'

import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import routes, { routesParams } from '../../constants/routes'
import { FacebookProvider } from 'react-facebook'
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
                    <FacebookProvider appId={process.env.REACT_APP_facebookId} >
                        <Navigation />
                        <Container>
                            <Authentization>
                                <Switch>
                                    {routes.map(route => <Route key={route.path} {...route} />)}
                                    {routesParams.map(route => <Route key={route.path} {...route} />)}
                                </Switch>
                            </Authentization>
                        </Container>
                    </FacebookProvider>
                </Firebase>
            </Themes>
        </HashRouter>
    )
}
