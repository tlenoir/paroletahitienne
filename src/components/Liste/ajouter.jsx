import React, { useContext, useState, useEffect } from 'react'
import { FirebaseContext } from "../../stores/Firebase/index"

import { Link } from 'react-router-dom'
import { Button, Modal, Form, Col, ButtonGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import 'moment/locale/fr'

import './liste.css'

export default function AjoutParole() {
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
    const handleChange = (event) => setItem({ ...item, [event.target.name]: event.target.value })

    const handleSubmit = (event) => {
        const form = event.currentTarget

        if (form.checkValidity()) {
            setItem({
                ...item,
                date_ajout: moment().local('fr').format('LLL'),
                ajout_par: user ? user.displayName : 'anonymous',
                uid: user ? user.uid : 'anonymous',
                artistes: item.artistes.length > 0 ? item.artistes.split(';') : ['Inconnu'],
                groupes: item.groupes.length > 0 ? item.groupes.split(';') : ['Inconnu']
            })
            setSubmit(true)
        }
        setValidated(true)
        event.preventDefault()
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

    const btnCircle = {
        borderRadius: '65%',
        left: '3%',
        bottom: '3%',
    }

    return (
        <React.Fragment>
            <Button className="d-none d-sm-block" onClick={handleOpen} variant="link">
                <FontAwesomeIcon className="mr-1" icon={faPlus} />
                Ajouter une chanson
            </Button>
            <Button className="d-sm-none btn-sq-sm d-block fixed-bottom"
                style={btnCircle}
                onClick={handleOpen} variant="dark" >
                <FontAwesomeIcon icon={faPlus} size="lg" />
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
                                    name='titre'
                                    value={item.titre}
                                    onChange={handleChange}
                                    type="text" />
                            </Form.Group>

                            <Form.Group as={Col} md="6" controlId="formGridArtiste">
                                <Form.Label>Artiste</Form.Label>
                                <Form.Control
                                    readOnly={submit}
                                    name='artistes'
                                    value={item.artistes}
                                    onChange={handleChange}
                                    type="text" placeholder="art1;art2" />
                            </Form.Group>
                        </Form.Row>
                        <Form.Group controlId="formGridGroup">
                            <Form.Label>Groupe</Form.Label>
                            <Form.Control
                                readOnly={submit}
                                name='groupes'
                                value={item.groupes}
                                onChange={handleChange}
                                type="text" placeholder="grp1;grp2" />
                        </Form.Group>

                        <Form.Group controlId="exampleForm.ControlParole">
                            <Form.Label>Parole</Form.Label>
                            <Form.Control
                                readOnly={submit}
                                name='paroles'
                                value={item.paroles}
                                onChange={handleChange}
                                as="textarea" rows="6" />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonGroup>
                            <Button
                                size="sm" as={Link}
                                to='/advance'
                                variant="link" onClick={handleClose}>
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