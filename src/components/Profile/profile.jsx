import React, { useContext } from 'react'
import { FirebaseContext } from "../../stores/Firebase/index"

import { Card, Alert, Spinner, Image } from 'react-bootstrap'


export default function Profile({ uid }) {

    const firebase = useContext(FirebaseContext)
    const [value, loading, error] = firebase.useDocument(
        firebase.firestore().doc(`utilisateurs/${uid}`),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    )

    return (
        <React.Fragment>
            <Card className="mb-3" body>Profile</Card>
            {error && <Alert variant="danger">Erreur: {error.message}</Alert>}
            {loading && <Spinner animation="grow" variant="primary"></Spinner>}
            {!loading && value && (
                <Card border="light" className="text-center">
                    <Image className="mx-auto w-25" src={value.data().avatar ? value.data().avatar : "https://via.placeholder.com/150"} roundedCircle />
                    <Card.Body>
                        <Card.Title>{value.data().nom} {value.data().prenom}</Card.Title>
                        <Card.Text>
                            Nom utilisateur: {value.data().utilisateur}
                        </Card.Text>
                        <Card.Subtitle className="mb-1 text-muted">{value.data().apropos}</Card.Subtitle>
                        <Card.Text>
                            Membre depuis le: {value.data().date_creation}
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}
        </React.Fragment>
    )
}