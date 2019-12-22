import React, { useContext, useState, useEffect } from 'react'
import { FirebaseContext } from "../../stores/Firebase/index"

import { Link } from 'react-router-dom'
import { Spinner, ListGroup, Alert, Button, Modal, Form, Col, ButtonGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import 'moment/locale/fr'

export default function Liste() {
    const firebase = useContext(FirebaseContext)

    const [docs, loading, error] = firebase.useCollection(
        firebase.firestore().collection('chansons'),
        {
            snapshotListenOptions: { includeMetadataChanges: true }
        }
    )
    return (
        <React.Fragment>
            {error && <Alert variant="danger">Erreur: {error.message}</Alert>}
            {loading && <Spinner animation="grow" variant="primary"></Spinner>}
            {docs && (
                <React.Fragment>
                    <AjoutParole />
                    <ListGroup variant="flush">
                        {docs.docs.map(doc => (
                            <ListGroup.Item variant="light" 
                            as={Link} to={`/liste=${doc.id}`} 
                            key={doc.id}>{doc.data().titre}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

function AjoutParole() {
    const firebase = useContext(FirebaseContext)
    const user = firebase.user

    const [validated, setValidated] = useState(false)
    const [submit, setSubmit] = useState(false)
    const [show, setShow] = useState(false)
    const [item, setItem] = useState({
        paroles: '',
        artistes: '',
        titre: '',
        groupes: '',
    })

    const handleOpen = () => setShow(true)
    const handleClose = () => setShow(false)
    const handleChange = (e) => setItem({ ...item, [e.target.name]: e.target.value })

    const handleSubmit = (e) => {
        const form = e.currentTarget

        if (form.checkValidity()) {
            setItem({
                ...item,
                date_ajout: moment().local('fr').format('LLL'),
                ajout_par: user ? user.displayName : 'anonymous',
                artistes: item.artistes.length > 0 ? item.artistes.split(';') : '',
                groupes: item.groupes.length > 0 ? item.groupes.split(';') : ''
            })
            setSubmit(true)
        }
        setValidated(true)
        e.preventDefault()
    }

    useEffect(() => {
        if (submit) {
            firebase.addParole(item)
                .then(() => {
                    setShow(false)
                    setItem({
                        paroles: '',
                        artistes: '',
                        titre: '',
                        groupes: '',
                    })
                })
                .then(() => {
                    setSubmit(false)
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submit])

    return (
        <React.Fragment>
            <Button onClick={handleOpen} variant="link">
                <FontAwesomeIcon className="mr-1" icon={faPlus} />
                Ajouter une chanson
            </Button>

            <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter une Chanson</Modal.Title>
                </Modal.Header>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>

                    <Modal.Body>
                        <Form.Row>
                            <Form.Group as={Col} md="6" controlId="formGridTiltle">
                                <Form.Label>Titre</Form.Label>
                                <Form.Control
                                    readOnly={submit} 
                                    required
                                    value={item.titre}
                                    name='titre'
                                    onChange={handleChange}
                                    type="text" />
                            </Form.Group>

                            <Form.Group as={Col} md="6" controlId="formGridArtiste">
                                <Form.Label>Artiste</Form.Label>
                                <Form.Control
                                    readOnly={submit}
                                    value={item.artistes}
                                    name='artistes'
                                    onChange={handleChange}
                                    type="text" placeholder="art1;art2" />
                            </Form.Group>
                        </Form.Row>
                        <Form.Group controlId="formGridGroup">
                            <Form.Label>Groupe</Form.Label>
                            <Form.Control
                                readOnly={submit}
                                value={item.groupes}
                                name='groupes'
                                onChange={handleChange}
                                type="text" placeholder="grp1;grp2" />
                        </Form.Group>

                        <Form.Group controlId="exampleForm.Control
                        readOnly={submit}Parole">
                            <Form.Label>Parole</Form.Label>
                            <Form.Control
                                readOnly={submit}
                                value={item.paroles}
                                name='paroles'
                                onChange={handleChange}
                                as="textarea" rows="6" />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonGroup>
                            <Button 
                                disabled={submit}
                                size="sm" as={Link}
                                to='/' variant="link" onClick={handleClose}>
                                création/avancée
                            </Button>
                            <Button 
                                disabled={submit}
                                variant="outline-secondary" onClick={handleClose}>
                                Fermer
                            </Button>
                            <Button 
                                disabled={submit}
                                variant="primary" type="submit">
                                Enregistrer
                            </Button>
                        </ButtonGroup>
                    </Modal.Footer>
                </Form>
            </Modal>
        </React.Fragment>
    )
}
