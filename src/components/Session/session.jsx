import React, { useContext, useState } from 'react'
import { FirebaseContext } from "../../stores/Firebase"
import { Button, Modal, Form, Dropdown, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCog } from '@fortawesome/free-solid-svg-icons'
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons'
import { Link } from 'react-router-dom'

function NotUser() {
    const firebase = useContext(FirebaseContext)
    const [show, setShow] = useState(false)
    const [validated, setValidated] = useState(false)
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [register, setRegister] = useState({
        email: '',
        passwd: ''
    })

    const handleChange = (event) => {
        setRegister({
            ...register,
            [event.target.name]: event.target.value
        })
    }

    const handleShow = () => setShow(true)
    const handleClose = () => {
        setShow(false)
        setError('')
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget
        if (form.checkValidity()) {
            setSubmitting(true)
            firebase.doSignInWithEmailAndPasswd(register)
                .then(() => {
                    setShow(false)
                    setRegister({ email: '', passwd: '' })
                })
                .catch(e => {
                    setError(e.message)
                    setSubmitting(false)
                })
        }
        setValidated(true)
        event.preventDefault()
    }

    const handleFacebook = () => {
        firebase.doSignInWithFacebook()
    }

    const handleGoogle = () => {
        firebase.doSignInWithGoogle()
    }

    return (
        <React.Fragment>

            <Button variant="dark" onClick={handleShow}>
                S'identifier
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Connectez-vous via
                        <FontAwesomeIcon
                            as={Link}
                            className="mr-1" onClick={handleFacebook}
                            pull="right" icon={faFacebookF} color="#3b5998" />
                        <FontAwesomeIcon
                            as={Link}
                            className="mr-1" onClick={handleGoogle}
                            icon={faGoogle} pull="right" color="#DD4B39" />
                    </Modal.Title>
                </Modal.Header>
                <Form noValidate validated={validated} onSubmit={handleSubmit} >
                    <Modal.Body>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email/Identifiant</Form.Label>
                            <Form.Control required type="email" readOnly={submitting}
                                value={register.email} name="email" onChange={handleChange} />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control required type="password" readOnly={submitting}
                                value={register.passwd} name="passwd" onChange={handleChange} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button as={Link} to="/signup"
                            variant="link"
                            onClick={handleClose}
                            disabled={submitting}>
                            créer un compte
                        </Button>
                        <Button variant="secondary"
                            onClick={handleClose}
                            disabled={submitting}>
                            Fermer
                        </Button>
                        <Button variant="primary"
                            type="submit"
                            disabled={submitting}>
                            S'identifier
                        </Button>
                        {error &&
                            <Alert variant="danger">{error}</Alert>
                        }
                    </Modal.Footer>
                </Form>
            </Modal>
        </React.Fragment>
    )
}

function User() {
    const firebase = useContext(FirebaseContext)
    const user = firebase.user

    const handleClick = () => {
        firebase.auth().signOut()
    }

    return (
        <Dropdown>
            <Dropdown.Toggle
                variant="info"
                id="dropdown-basic">
                <FontAwesomeIcon
                    className="mr-1"
                    icon={faUserCog} />
                {user.displayName}
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-menu-md-right">
                <Dropdown.Item as={Link} to='/profile'>Profile</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleClick} >Déconnecter</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export { User, NotUser }
