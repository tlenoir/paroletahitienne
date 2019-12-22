import React, { useContext } from 'react'
import { FirebaseContext } from "../../stores/Firebase/index"

import { Card, Alert, Spinner, CardColumns } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

export default function Favoris({ uid }) {

    const firebase = useContext(FirebaseContext)

    const [value, loading, error] = firebase.useCollection(
        firebase.firestore().collection(`favoris/${uid}/all`),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        })

    const handleDelete = (ref, event) => {
        firebase.firestore().doc(ref).delete()
        event.preventDefault()
    }

    return (
        <React.Fragment>
            <Card className="mb-3" body>Favoris</Card>
            {error && <Alert variant="danger">Erreur: {error.message}</Alert>}
            {loading && <Spinner animation="grow" variant="primary"></Spinner>}
            {!loading && value && (
                <CardColumns>
                    {value.docs.map((doc, i) => (
                        <Card key={doc.id} border="dark">
                            <Card.Header>
                                {i + 1}
                                <FontAwesomeIcon
                                    icon={faTrashAlt}
                                    pull="right"
                                    size="lg"
                                    onClick={e => handleDelete(doc.ref.path, e)}
                                    color='red'
                                />
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>{doc.data().titre}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    Artiste: {doc.data().artiste}
                                </Card.Subtitle>
                                <footer className="blockquote-footer">
                                    Ajoutée par <cite title={doc.data().ajout_par}>{doc.data().createBy}</cite>
                                </footer>
                                <Card.Link as={Link} to={`/liste=${doc.data().id}`}>
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