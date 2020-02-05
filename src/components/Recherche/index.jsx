import React, { useContext, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { FirebaseContext } from '../../stores/Firebase/index'
import { ThemesContext } from '../../stores/Themes/index'
import { Card, Alert, Spinner, CardColumns, Form, FormControl, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function Recherche() {
    const { queries } = useParams('queries')
    const firebase = useContext(FirebaseContext)
    const themes = useContext(ThemesContext)
    themes.updateTitle('Recherche')
    const [docs, loading, error] = firebase.useCollection(
        firebase.firestore().collection('chansons').where('index', 'array-contains-any', queries.split('&'))
    )

    return (
        <React.Fragment>
            <Card className="mb-3" body>Recherche {queries.split('&').join(' & ')}</Card>
            {error && <Alert variant="danger">Erreur: {error.message}</Alert>}
            {loading && <Spinner animation="grow" variant="primary"></Spinner>}
            {!loading && docs && (
                <CardColumns>
                    {docs.docs.map((doc, i) => (
                        <Card key={doc.id} border="dark">
                            <Card.Header>
                                {i + 1}
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>{doc.data().titre}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    Artiste: {doc.data().artistes.join(' & ')}
                                </Card.Subtitle>
                                <footer className="blockquote-footer">
                                    Ajoutée par <cite title={doc.data().ajout_par}>{doc.data().ajout_par}</cite>
                                </footer>
                                <Card.Link as={Link} to={`/liste=${doc.id}`}>
                                    Consulter
                                </Card.Link>
                            </Card.Body>
                        </Card>
                    ))}
                </CardColumns>
            )}
        </React.Fragment>
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
                <Button type="submit" variant="outline-success" className="mr-sm-1" >Recherche</Button>
            </Form>
        </React.Fragment>
    )
}
