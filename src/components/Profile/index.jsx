import React from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useObject } from 'react-firebase-hooks/database';
import { Card, Button, Alert, Spinner, Row, Col, Image, Container } from 'react-bootstrap';

export default function Profile() {
    const [user, initialising, error] = useAuthState(firebase.auth());
    return (
        <div>
            {error && <Alert variant="danger">Erreur: {error.message}</Alert>}
            {initialising && <Spinner animation="grow" variant="primary"></Spinner>}
            {user && <ObjectProfile uid={user.uid} />}
        </div>
    )

}

function ObjectProfile({ uid }) {
    const [value, loading, error] = useObject(firebase.database().ref(`users/${uid}`));
    return (
        <div>
            {error && <Alert variant="danger">Erreur: {error.message}</Alert>}
            {loading && <Spinner animation="grow" variant="primary"></Spinner>}
            {!loading && value && (
                <Card border="light" className="text-center">
                    <Container>
                        <Row>
                            <Col></Col>
                            <Col>
                                <Image src="https://via.placeholder.com/300" roundedCircle />
                            </Col>
                            <Col></Col>
                        </Row>
                    </Container>
                    <Card.Body>
                        <Card.Title>{value.val().lastname} {value.val().firstname}</Card.Title>
                        <Card.Text>
                            With supporting text below as a natural lead-in to additional content.
                                </Card.Text>
                        <Button variant="primary">Go somewhere</Button>
                    </Card.Body>
                </Card>
            )}
        </div>
    )
}
