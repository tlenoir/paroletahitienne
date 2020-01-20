import React, { useContext } from 'react'
import { ThemesContext } from "../../stores/Themes/index"

export default function Accueil() {
    const themes = useContext(ThemesContext)

    themes.updateTitle('Accueil')
    
    return (
        <div>
            Accueil page.
        </div>
    )
}
