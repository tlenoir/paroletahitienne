import React, { useContext, useState, useEffect } from 'react'
import { FirebaseContext } from "../../stores/Firebase"
import { useParams } from 'react-router-dom'
import { Spinner, Jumbotron, Button, Alert, Form } from 'react-bootstrap'
import TextareaAutosize from 'react-textarea-autosize'

export default function Parole() {
    const firebase = useContext(FirebaseContext)
    const { id } = useParams()
    const [submitting, setSubmitting] = useState(true)
    const [item, setItem] = useState({
        paroles: '',
        titre: ''
    })

    const [doc, loading, error] = firebase.useDocument(
        firebase.firestore().doc(`chansons/${id}`),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    )

    const handleEdit = (event) => {
        setSubmitting(false)
        event.preventDefault()
    }

    const handleChange = (event) => {
        setItem({
            ...item,
            [event.target.name]: event.target.value
        })
    }

    useEffect(() => {
        if (doc !== undefined && doc.exists)
            setItem({
                titre: doc.data().titre,
                paroles: doc.data().paroles
            })
        else
            setItem({
                titre: "Ce document n'existe pas."
            })
    }, [doc])

    return (
        <React.Fragment>
            {error && <Alert variant="danger">Erreur: {error.message}</Alert>}
            {loading && <Spinner animation="grow" variant="primary" />}
            {doc &&
                <Jumbotron>
                    <Button disabled={!doc.exists}
                        variant="link" size="sm"
                        onClick={handleEdit}>
                        edité
                    </Button>
                    <Form>
                        <Form.Group controlId="exampleForm.ControlInputTitre">
                            <Form.Label srOnly={submitting}>Titre</Form.Label>
                            <Form.Control
                                size="lg"
                                value={item.titre}
                                name="titre"
                                plaintext={submitting}
                                required
                                onChange={handleChange}
                                readOnly={submitting} type="text" />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlTextareaParole">
                            <Form.Label srOnly={submitting}>Parole</Form.Label>
                            <Form.Control
                                value={item.paroles}
                                name="paroles"
                                plaintext={submitting}
                                required
                                onChange={handleChange}
                                readOnly={submitting} as={TextareaAutosize} />
                        </Form.Group>
                    </Form>
                </Jumbotron>
            }
        </React.Fragment>
    )
}
