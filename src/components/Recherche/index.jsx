import React, { useContext, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { FirebaseContext } from '../../stores/Firebase/index'
import { ThemesContext } from '../../stores/Themes/index'
import { Form, Button, FormControl } from 'react-bootstrap'

export default function Recherche() {
    const { queries } = useParams('queries')
    const firebase = useContext(FirebaseContext)
    const themes = useContext(ThemesContext)
    themes.updateTitle('Recherche')
    const [docs, loading, error] = firebase.useCollection(
        firebase.firestore().collection('chansons').where('titre', 'in', queries.split('&'))
    )

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>error</p>}
            {docs && <div>
                {docs.docs.map((doc, i) => (
                    <div key={i}>
                        <p>{doc.data().titre}</p>
                    </div>
                ))}
            </div>}
        </div>
    )
}

export function RechercheForm() {
    const [queries, setQueries] = useState('')
    const history = useHistory()
    const handleChange = (event) => {
        setQueries(event.target.value)
    }

    const handleSearch = (event) => {
        history.push("/search=" + queries.split(' ').join('&'))
        event.preventDefault()
    }

    return (
        <React.Fragment>
            <Form inline onSubmit={handleSearch}>
                <FormControl value={queries} name="queries"
                    type="text" onChange={handleChange} className="mr-sm-2" />
                <Button type="submit" variant="outline-success">Recherche</Button>
            </Form>
        </React.Fragment>
    )
}
