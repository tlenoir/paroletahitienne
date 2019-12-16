import React, { useDebugValue } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import routes from '../../constants/routes'

export default function App() {
    useDebugValue(process.env.REACT_APP_SECRET_CODE)
    const dev = process.env.NODE_ENV !== "production";
    return (
        <BrowserRouter basename={dev ? '' : process.env.REACT_APP_PUBLIC_URL}>
            <Switch>
                {routes.map(route => <Route key={route.path} {...route} />)}
            </Switch>
        </BrowserRouter>
    )
}
