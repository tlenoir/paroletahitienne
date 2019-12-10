import React, { useState } from 'react'
import firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/database'
import { Button, Row, Form, Col, Modal, Alert, ButtonToolbar, Dropdown } from 'react-bootstrap'
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog } from '@fortawesome/free-solid-svg-icons';

export default function App() {
    const [user] = useAuthState(firebase.auth())
    return (
        <span>
            {!user && <LogIn />}
            {user && <LogOut />}
        </span>
    )
}

function LogIn(props) {
    const [error, setError] = useState("")
    const [register, setRegister] = useState({
        email: "",
        passwd: "",
        lastname: "",
        firstname: "",
        username: ""
    })

    const handleChange = (e) => {
        setRegister({
            ...register,
            [e.target.name]: e.target.value
        })
    }

    const [showLogin, setShowLogin] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const handleCloseLogin = () => setShowLogin(false);
    const handleCloseCreate = () => setShowCreate(false);
    const handleShowLogin = () => setShowLogin(true);
    const handleShowCreate = () => {
        setShowLogin(false)
        setShowCreate(true)
    };

    const signInWithEmail = (event) => {
        firebase.auth().signInWithEmailAndPassword(register.email, register.passwd)
            .then(() => {
                setShowLogin(false)
                setError("")
            })
            .catch(error => {
                if (error.code === ERROR_CODE_ACCOUNT_NOEXISTS)
                    setError(error.message)
            })
        event.preventDefault()
    }

    /* const signInAnonymous = (event) => {
        firebase.auth().signInAnonymously()
            .then(() => {
                return firebase.auth().currentUser.updateProfile({
                    displayName: "Anonymous"
                });
            })
            .catch(error => {
                setError(error.message)
            })
        event.preventDefault()
    } */

    function createNewUser(event) {
        firebase.auth()
            .createUserWithEmailAndPassword(register.email, register.passwd)
            .then(authUser => {
                // Create a user in your Firebase Realtime database
                return firebase
                    .database().ref(`users/${authUser.user.uid}`)
                    .set({
                        email: register.email,
                        firstname: register.firstname,
                        lastname: register.lastname,
                        dateCreatedAccount: firebase.firestore.Timestamp.fromDate(new Date()),
                        username: register.username,
                    });
            })
            .then(() => {
                return firebase.auth().currentUser.sendEmailVerification({
                    url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
                })
            })
            .then(() => {
                return firebase.auth().currentUser.updateProfile({
                    displayName: register.username,
                });
            })
            .then(() => {
                setRegister({
                    ...register,
                    username: '',
                    email: '',
                    passwd: '',
                    lastname: '',
                    firstname: '',
                });
                setError("")
                props.history.push('/')
            })
            .catch(error => {
                if (error.code === ERROR_CODE_ACCOUNT_EXISTS)
                    setError(error.message);
            });
        event.preventDefault();
    };

    return (
        <span>
            <ButtonToolbar>
                <Button className="ml-1" onClick={handleShowLogin} variant="link">Se connecter</Button>
            </ButtonToolbar>

            <Modal show={showLogin} onHide={handleCloseLogin}>
                <Modal.Header closeButton>
                    <Modal.Title>Connectez-vous</Modal.Title>
                </Modal.Header>
                <Form onSubmit={signInWithEmail}>
                    <Modal.Body>
                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Form.Label column sm="2">
                                Identifiant
                                    </Form.Label>
                            <Col sm="10">
                                <Form.Control value={register.email} name="email" onChange={handleChange} type="email" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formPlaintextPassword">
                            <Form.Label column sm="2">
                                Mot de passe
                                    </Form.Label>
                            <Col sm="10">
                                <Form.Control type="password" value={register.passwd} name="passwd" onChange={handleChange} />
                            </Col>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseLogin}>
                            Fermer
                                </Button>
                        <Button variant="primary" type="submit">
                            S'identifier
                                </Button>
                        {error &&
                            <Alert variant="danger">{error}</Alert>
                        }
                    </Modal.Footer>
                </Form>
                <ButtonToolbar>
                    <Button size="sm" onClick={handleShowCreate} variant="link">Créer un compte</Button>
                </ButtonToolbar>
            </Modal>

            <Modal show={showCreate} onHide={handleCloseCreate}>
                <Modal.Header closeButton>
                    <Modal.Title>Créer un nouvel utilisateur</Modal.Title>
                </Modal.Header>
                <Form onSubmit={createNewUser}>
                    <Modal.Body>
                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Form.Label column sm="2">
                                Email
                                    </Form.Label>
                            <Col sm="10">
                                <Form.Control type="email" required value={register.email} name="email" onChange={handleChange} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formPlaintextPassword">
                            <Form.Label column sm="2">
                                Mot de passe
                                    </Form.Label>
                            <Col sm="10">
                                <Form.Control required value={register.passwd} name="passwd" onChange={handleChange} type="password" />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Form.Label column sm="2">
                                Nom
                                    </Form.Label>
                            <Col sm="10">
                                <Form.Control className="text-capitalize" type="text" required value={register.lastname} name="lastname" onChange={handleChange} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Form.Label column sm="2">
                                Prénom
                                    </Form.Label>
                            <Col sm="10">
                                <Form.Control className="text-capitalize" type="text" required value={register.firstname} name="firstname" onChange={handleChange} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Form.Label column sm="2">
                                Nom utilsateur
                                    </Form.Label>
                            <Col sm="10">
                                <Form.Control type="text" required value={register.username} name="username" onChange={handleChange} />
                            </Col>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseCreate}>
                            Annuler
                                </Button>
                        <Button variant="primary" type="submit">
                            Enregistrer
                                </Button>
                        {error &&
                            <Alert variant="danger">{error}</Alert>
                        }
                    </Modal.Footer>
                </Form>
            </Modal>
        </span>
    )
}

function LogOut() {
    const handleClick = () => {
        firebase.auth().signOut()
    }
    return (
        <ButtonToolbar>
            <Dropdown>
                <Dropdown.Toggle variant="link" id="dropdown-custom-1">
                    <FontAwesomeIcon
                        icon={faUserCog}
                        size="lg"
                    />
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-md-right">
                    <Dropdown.Item as={Link} to="/profile" eventKey="1">Profile</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleClick} eventKey="4">Se Déconnecter</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </ButtonToolbar>
    )
}

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';
const ERROR_CODE_ACCOUNT_NOEXISTS = "auth/user-not-found"