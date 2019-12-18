import React, { useContext, useState } from 'react'
import { FirebaseContext } from "../../stores/Firebase/index"

import { Link } from 'react-router-dom'
import { Spinner, ListGroup, Alert, Button, Modal, Form, Col, ButtonGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import 'moment/locale/fr'

export default function App() {
    const firebase = useContext(FirebaseContext)

    const [docs, loading, error] = firebase.useCollection(
        firebase.firestore().collection('chansons'),
        {
            snapshotListenOptions: { includeMetadataChanges: true }
        }
    )
    return (
        <React.Fragment>
            {error && <Alert variant="danger">Erreur: {error}</Alert>}
            {loading && <Spinner animation="grow" variant="primary"></Spinner>}
            {docs && (
                <React.Fragment>
                    <AjoutParole />
                    <ListGroup variant="flush">
                        {docs.docs.map(doc => (
                            <ListGroup.Item key={doc.id}>{doc.data().titre}</ListGroup.Item>
                        ))}
                    </ListGroup>
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

function AjoutParole() {
    const firebase = useContext(FirebaseContext)
    const [user] = firebase.useAuthState(firebase.auth())

    const [validated, setValidated] = useState(false)
    const [show, setShow] = useState(false)
    const [item, setItem] = useState({
        parole: '',
        artistes: '',
        titre: '',
        groupes: '',
    })

    const handleOpen = () => setShow(true)
    const handleClose = () => setShow(false)
    const handleChange = (e) => setItem({ ...item, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        const form = e.currentTarget

        if (form.checkValidity()) {
            await setItem({
                ...item,
                date_ajout: moment().local('fr').format('LLL'),
                ajout_par: user ? user.displayName : 'anonymous',
                artistes: item.artistes.split(';'),
                groupes: item.groupes.split(';')
            })
            /* firebase.addParole(item)
                .then(() => {
                    setShow(false)
                }) */
            console.log('item', item);
        }
        setValidated(true)
        e.preventDefault()
    }

    return (
        <React.Fragment>
            <Button onClick={handleOpen} variant="link">
                <FontAwesomeIcon icon={faPlus} />
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
                                <Form.Control required
                                    value={item.titre}
                                    name='titre'
                                    onChange={handleChange}
                                    type="text" />
                            </Form.Group>

                            <Form.Group as={Col} md="6" controlId="formGridArtiste">
                                <Form.Label>Artiste</Form.Label>
                                <Form.Control
                                    value={item.artistes}
                                    name='artistes'
                                    onChange={handleChange}
                                    type="text" placeholder="art1;art2" />
                            </Form.Group>
                        </Form.Row>
                        <Form.Group controlId="formGridGroup">
                            <Form.Label>Groupe</Form.Label>
                            <Form.Control
                                value={item.groupes}
                                name='groupes'
                                onChange={handleChange}
                                type="text" placeholder="grp1;grp2" />
                        </Form.Group>

                        <Form.Group controlId="exampleForm.ControlParole">
                            <Form.Label>Parole</Form.Label>
                            <Form.Control
                                value={item.parole}
                                name='parole'
                                onChange={handleChange}
                                as="textarea" rows="6" />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonGroup>
                            <Button size="sm" as={Link}
                                to='/' variant="link" onClick={handleClose}>
                                création/avancée
                            </Button>
                            <Button variant="outline-secondary" onClick={handleClose}>
                                Fermer
                            </Button>
                            <Button variant="primary" type="submit">
                                Enregistrer
                            </Button>
                        </ButtonGroup>
                    </Modal.Footer>
                </Form>
            </Modal>
        </React.Fragment>
    )
}
