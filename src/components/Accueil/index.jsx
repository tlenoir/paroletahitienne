import React, { useContext } from 'react'
import { ThemesContext } from "../../stores/Themes/index"
import { Like } from 'react-facebook'

export default function Accueil() {
    const themes = useContext(ThemesContext)

    themes.updateTitle('Accueil')

    return (
        <React.Fragment>
            <h1>Accueil Page</h1>
            <Like href="https://www.facebook.com/paroleheritage" colorScheme="dark"
            showFaces share />
        </React.Fragment>
    )
}
