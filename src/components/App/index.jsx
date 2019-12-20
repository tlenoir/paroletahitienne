import 'bootstrap/dist/css/bootstrap.min.css'

import React, { useDebugValue } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import routes, { routesParams } from '../../constants/routes'
import { Firebase } from "../../stores/Firebase/index";
import Navigation from "../Navigation/index"

export default function App() {
    useDebugValue(process.env.REACT_APP_SECRET_CODE)
    const dev = process.env.NODE_ENV !== "production";
    return (
        <BrowserRouter basename={dev ? '' : process.env.REACT_APP_PUBLIC_URL}>
            <Firebase>
                <Navigation />
                <div className="container">
                    <Switch>
                        {routes.map(route => <Route key={route.path} {...route} />)}
                        {routesParams.map(route => <Route key={route.path} {...route} />)}
                    </Switch>
                </div>
            </Firebase>
        </BrowserRouter>
    )
}
