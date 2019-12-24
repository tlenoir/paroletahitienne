import React, { useContext, useState, useEffect } from 'react'
import { FirebaseContext } from "../../stores/Firebase"
import { useParams } from 'react-router-dom'
import { Spinner, Breadcrumb, Alert, Form, Row, Col, Card } from 'react-bootstrap'
import TextareaAutosize from 'react-textarea-autosize'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faFileContract } from '@fortawesome/free-solid-svg-icons'
import Previewer from "./AvanceParole/components/Previewer/Previewer"

export default function Parole() {
    const firebase = useContext(FirebaseContext)
    const { id } = useParams()
    const [submitting, setSubmitting] = useState(true)
    const [item, setItem] = useState({
        paroles: '',
        titre: '',
        artistes: '',
        groupes: '',
    })
    const [mode, setMode] = useState(false)
    const [itemPreview, setItemPreview] = useState({
        content: '',
        song: '',
        singer: '',
        composer: '',
        isEmbedChord: false
    })

    const [doc, loading, error] = firebase.useDocument(
        firebase.firestore().doc(`chansons/${id}`),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    )

    const handleEdit = (event) => {
        setSubmitting(!submitting)
        setMode(false)
        event.preventDefault()
    }

    const handleChange = (event) => {
        setItem({
            ...item,
            [event.target.name]: event.target.value
        })
    }

    useEffect(() => {
        if (doc !== undefined && doc.exists) {
            setItem({
                titre: doc.data().titre,
                paroles: doc.data().paroles,
                artistes: doc.data().artistes,
                groupes: doc.data().groupes
            })
        }
        else
            setItem({
                titre: "Ce document n'existe pas."
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [doc])

    const handleMode = () => {
        setItemPreview({
            content: item.paroles,
            singer: item.artistes,
            composer: item.groupes,
            song: item.titre
        })
        setMode(!mode)
    }

    return (
        <React.Fragment>
            {error && <Alert variant="danger">Erreur: {error.message}</Alert>}
            {loading && <Spinner animation="grow" variant="primary" />}
            {doc &&
                <Card>
                    <Breadcrumb>
                        <Breadcrumb.Item
                            onClick={handleEdit}>
                            Editée <FontAwesomeIcon size="lg" icon={faEdit} />
                        </Breadcrumb.Item>
                        <Breadcrumb.Item
                            onClick={handleMode}>
                            Change mode <FontAwesomeIcon size="lg" icon={faFileContract} />
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Card.Body>
                        {mode ?
                            <Previewer
                                isEdit={true}
                                headerForm={itemPreview}
                                editorForm={itemPreview} />
                            :
                            <Form>
                                <Row>
                                    <Form.Group as={Col} md controlId="exampleForm.ControlInputTitre">
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
                                    <Form.Group as={Col} md controlId="exampleForm.ControlInputArtiste">
                                        <Form.Label srOnly={submitting}>Artiste</Form.Label>
                                        <Form.Control
                                            size="lg"
                                            value={item.artistes}
                                            name="artistes"
                                            plaintext={submitting}
                                            required
                                            onChange={handleChange}
                                            readOnly={submitting} type="text" />
                                    </Form.Group>
                                    <Form.Group as={Col} md controlId="exampleForm.ControlInputGroupe">
                                        <Form.Label srOnly={submitting}>Groupe</Form.Label>
                                        <Form.Control
                                            size="lg"
                                            value={item.groupes}
                                            name="groupes"
                                            plaintext={submitting}
                                            required
                                            onChange={handleChange}
                                            readOnly={submitting} type="text" />
                                    </Form.Group>
                                </Row>
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
                        }
                    </Card.Body>
                </Card>
            }
        </React.Fragment>
    )
}
