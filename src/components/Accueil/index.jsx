import React, { useContext } from 'react'
import { ThemesContext } from "../../stores/Themes/index"
import { Like } from 'react-facebook'
import { Card } from 'react-bootstrap'

export default function Accueil() {
    const themes = useContext(ThemesContext)

    themes.updateTitle('Accueil')

    return (
        <React.Fragment>
            <Card text="info" border="info" body>
                Le site est en cours de construction, mais vous pouvez toujours rendre une visite dans la rubrique Liste pour voir un petit aperçu du site. Bonne visite.
            </Card>
            <Like href="https://www.facebook.com/paroleheritage" colorScheme="dark"
                showFaces share />
        </React.Fragment>
    )
}
