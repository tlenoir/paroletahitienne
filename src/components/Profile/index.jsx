import React from 'react'
import firebase, { firestore } from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useObject } from 'react-firebase-hooks/database';

import { Card, Alert, Spinner, Row, Col, Image, Nav, Tab, CardColumns } from 'react-bootstrap';
import { useCollection } from 'react-firebase-hooks/firestore'
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faListOl, faStar, faUser, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

export default function App() {
    const [user, initialising, error] = useAuthState(firebase.auth());
    return (
        <div>
            {error && <Alert variant="danger">Erreur: {error.message}</Alert>}
            {initialising && <Spinner animation="grow" variant="primary"></Spinner>}
            {user && (
                <Tab.Container id="left-tabs-example" defaultActiveKey="third">
                    <Row>
                        <Col md={3}>
                            <Nav variant="tabs" className="flex-md-column mb-1">
                                <Nav.Item>
                                    <Nav.Link eventKey="first">
                                        <FontAwesomeIcon icon={faMusic} />
                                        <FontAwesomeIcon icon={faListOl} />
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="second">
                                        <FontAwesomeIcon icon={faStar} />
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="third">
                                        <FontAwesomeIcon icon={faUser} />
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col md={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="third">
                                    <Profile uid={user.uid} />
                                </Tab.Pane>
                                <Tab.Pane eventKey="first">
                                    <Chansons uid={user.uid} />
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                    <Favoris uid={user.uid} />
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            )}
            {!user && <p>Pas de profile pour vous xD. Veuillez créer un compte!</p>}
        </div>
    )

}

function Profile({ uid }) {
    const [value, loading, error] = useObject(firebase.database().ref(`users/${uid}`));
    return (
        <div>
            <Card className="mb-3" body>Profile</Card>
            {error && <Alert variant="danger">Erreur: {error.message}</Alert>}
            {loading && <Spinner animation="grow" variant="primary"></Spinner>}
            {!loading && value && (
                <Card border="light" className="text-center">
                    <Row>
                        <Col></Col>
                        <Col>
                            <Image src="https://via.placeholder.com/300" roundedCircle />
                        </Col>
                        <Col></Col>
                    </Row>
                    <Card.Body>
                        <Card.Title>{value.val().lastname} {value.val().firstname}</Card.Title>
                        <Card.Text>
                            Nom utilisateur: {value.val().username}
                        </Card.Text>
                        <Card.Text>
                            Créer le: {value.val().dateCreatedAccount}
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}
        </div>
    )
}

function Favoris({ uid }) {

    const [value, loading, error] = useCollection(
        firestore().collection(`users/${uid}/favorites`),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        })

    const handleDelete = (ref, event) => {
        firestore().doc(ref).delete()
        event.preventDefault()
    }

    return (
        <div>
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
                                    Ajoutée par <cite title={doc.data().createBy}>{doc.data().createBy}</cite>
                                </footer>
                                <Card.Link as={Link} to={`/liste=${doc.data().id}`}>
                                    Consulter
                                </Card.Link>
                            </Card.Body>
                        </Card>
                    ))}
                </CardColumns>
            )}
        </div>
    )
}

function Chansons({ uid }) {

    const [value, loading, error] = useCollection(
        firestore().collection(`users/${uid}/chansons`),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        })

    return (
        <div>
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
                                {/* <FontAwesomeIcon
                                    icon={faTrashAlt}
                                    pull="right"
                                    size="lg"
                                    onClick={e => handleDelete(doc.ref.path, e)}
                                    color='red'
                                /> */}
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>{doc.data().titre}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    Artiste: {doc.data().artiste}
                                </Card.Subtitle>
                                <footer className="blockquote-footer">
                                    Ajoutée le <cite title={doc.data().createAt.toDate().toString()}>{doc.data().createAt.toDate().toString()}</cite>
                                </footer>
                                <Card.Link as={Link} to={`/liste=${doc.data().id}`}>
                                    Consulter
                                </Card.Link>
                            </Card.Body>
                        </Card>
                    ))}
                </CardColumns>
            )}
        </div>
    )
}
