import React from 'react'
import { useParams } from 'react-router-dom';
import firebase from 'firebase/app'
import 'firebase/firestore'
import { useDocumentOnce } from 'react-firebase-hooks/firestore';
import { Alert, Spinner, Jumbotron, Container } from 'react-bootstrap';

export default function Parole() {
    const { id } = useParams()
    const [value, loading, error] = useDocumentOnce(
        firebase.firestore().doc('paroles/' + id),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );
    return (
        <div>
            {error && <Alert variant="danger">Erreur: {error}</Alert>}
            {loading && <Spinner animation="grow" variant="primary"></Spinner>}
            {value && (
                <Jumbotron fluid>
                    <Container>
                        <h1>{value.data().titre}</h1>
                        <pre>
                            {value.data().parole}
                        </pre>
                    </Container>
                </Jumbotron>
            )}
        </div>
    )
}