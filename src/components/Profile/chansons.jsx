import React, { useContext } from 'react'
import { FirebaseContext } from "../../stores/Firebase/index"

import { Card, Alert, Spinner, CardColumns } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

export default function Chansons({ uid }) {

    const firebase = useContext(FirebaseContext)

    const [value, loading, error] = firebase.useCollection(
        firebase.firestore().collection('chansons').where("uid", "==", uid),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        })

    const handleDelete = (doc, event) => {
        firebase.firestore().doc(`paroles/${doc.data().id}`).delete()
        firebase.firestore().doc(doc.ref.path).delete()
        event.preventDefault()
    }

    return (
        <React.Fragment>
            <Card className="mb-3" body>Chansons</Card>
            {error && <Alert variant="danger">Erreur: {error.message}</Alert>}
            {!error && <Alert variant="info">La liste des chansons que vous avez contribuées à ajouter!</Alert>}
            {loading && <Spinner animation="grow" variant="primary"></Spinner>}
            {!loading && value && (
                <CardColumns>
                    {value.docs.map((doc, i) => (
                        <Card key={doc.id} border="success">
                            <Card.Header>
                                {i + 1}
                                <FontAwesomeIcon
                                    icon={faTrashAlt}
                                    pull="right"
                                    size="lg"
                                    onClick={e => handleDelete(doc, e)}
                                    color='red'
                                />
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    {doc.data().titre}
                                </Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    Artiste: {doc.data().artistes}
                                </Card.Subtitle>
                                <footer className="blockquote-footer">
                                    Ajoutée le <cite title={doc.data().date_ajout}>{doc.data().date_ajout}</cite>
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