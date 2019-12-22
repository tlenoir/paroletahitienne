import React, { useContext } from 'react'
import { useRouteMatch, Redirect } from 'react-router-dom'
import { FirebaseContext } from "../Firebase/index"

export default function Authentization({ children }) {
    const firebase = useContext(FirebaseContext)
    const notUser = useRouteMatch(['/profile'])
    const user = useRouteMatch(['/signin', '/signup'])

    return !firebase.user && notUser ?
        <Redirect to='/signin' />
        :
        firebase.user && user ?
            <Redirect to='/' />
            :
            <React.Fragment>
                {children}
            </React.Fragment>
}
