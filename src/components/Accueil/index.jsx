import React from 'react'
import { Link } from 'react-router-dom'

export default function App() {
    return (
        <div>
            Accueil page.
            <Link to='/about' >À propos</Link>
        </div>
    )
}
