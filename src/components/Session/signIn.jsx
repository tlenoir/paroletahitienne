import React, { useContext, useState } from 'react'
import { FirebaseContext } from "../../stores/Firebase"
import { Button, Card, Form, Alert, } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons'
import { Link, useHistory } from 'react-router-dom'

export default function SignIn() {
    const firebase = useContext(FirebaseContext)
    const history = useHistory()
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

    const handleSubmit = (event) => {
        const form = event.currentTarget
        if (form.checkValidity()) {
            setSubmitting(true)
            firebase.doSignInWithEmailAndPasswd(register)
                .then(() => {
                    setRegister({ email: '', passwd: '' })
                })
                .then(() => {
                    history.push('/')
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
            <Card>
                <Card.Header>
                    <Card.Title>
                        Connectez-vous via
                        <FontAwesomeIcon className="ml-2"
                            onClick={handleFacebook}
                            icon={faFacebookF} color="#3b5998" />
                        <FontAwesomeIcon className="ml-2"
                            onClick={handleGoogle}
                            icon={faGoogle} color="#DD4B39" />
                    </Card.Title>
                </Card.Header>
                <Form noValidate validated={validated} onSubmit={handleSubmit} >
                    <Card.Body>
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
                    </Card.Body>
                    <Card.Footer>
                        <Button as={Link} to="/signup"
                            variant="link"
                            disabled={submitting}>
                            créer un compte
                        </Button>
                        <Button variant="primary"
                            type="submit"
                            disabled={submitting}>
                            S'identifier
                        </Button>
                        {error &&
                            <Alert variant="danger">{error}</Alert>
                        }
                    </Card.Footer>
                </Form>
            </Card>
        </React.Fragment>
    )
}
