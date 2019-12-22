import React, { useContext } from 'react'
import { FirebaseContext } from "../../stores/Firebase/index"
import { User, NotUser } from "./session"

export default function Session() {
    const firebase = useContext(FirebaseContext)
    const user = firebase.user
    return (
        <React.Fragment>
            {user && <User />}
            {!user && <NotUser />}
        </React.Fragment>
    )
}