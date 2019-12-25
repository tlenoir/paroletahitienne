import React, { useContext, useState, useReducer, useEffect } from 'react'
import { FirebaseContext } from "../../stores/Firebase/index"

import { Link, useHistory } from 'react-router-dom'
import { Spinner, Alert, Button, Modal, Form, Col, ButtonGroup, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import 'moment/locale/fr'

import './liste.css'

const initialState = {orderBy: 'titre'}

function reducer(state, action) {
  switch (action.type) {
    case 'artiste':
      return {orderBy: 'artistes'}
    case 'groupe':
      return {orderBy: 'groupes'}
    case 'date':
        return {orderBy: 'date_ajout'}
    case 'titre':
        return {orderBy: 'titre'}
    default:
      return state
  }
}

export default function Liste() {
    const firebase = useContext(FirebaseContext)
    const history = useHistory()

    const [state, dispatch] = useReducer(reducer, initialState)

    const [docs, loading, error] = firebase.useCollection(
        firebase.firestore().collection('chansons').orderBy(state.orderBy),
        {
            snapshotListenOptions: { includeMetadataChanges: true }
        }
    )

    const handleClick = (event, id) => {
        history.push(`/liste=${id}`)
        event.preventDefault()
    }

    return (
        <React.Fragment>
            {error && <Alert variant="danger">Erreur: {error.message}</Alert>}
            {loading && <Spinner animation="grow" variant="primary"></Spinner>}
            {docs && (
                <React.Fragment>
                        <AjoutParole />
                    <Table striped responsive hover>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th onClick={() => dispatch({type: 'titre'})}>Titre</th>
                        <th onClick={() => dispatch({type: 'artiste'})}>Artiste</th>
                        <th onClick={() => dispatch({type: 'groupe'})}>Groupe</th>
                        <th onClick={() => dispatch({type: 'date'})}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                    {docs.docs.map((doc, i) => (
                        <tr key={doc.id} onClick={(e) => handleClick(e, doc.id)}>
                            <td>{i+1}</td>
                            <td>{doc.data().titre}</td>
                            <td>{doc.data().artistes.join(';')}</td>
                            <td>{doc.data().groupes.join(';')}</td>
                            <td>{doc.data().date_ajout}</td>
                        </tr>
                        ))}
                    </tbody>
                    </Table>
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
                uid: user ? user.uid : 'anonymous',
                artistes: item.artistes.length > 0 ? item.artistes.split(';') : ['Inconnu'],
                groupes: item.groupes.length > 0 ? item.groupes.split(';') : ['Inconnu']
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
                                    onChange={handleChange}
                                    type="text" />
                            </Form.Group>

                            <Form.Group as={Col} md="6" controlId="formGridArtiste">
                                <Form.Label>Artiste</Form.Label>
                                <Form.Control
                                    readOnly={submit}
                                    name='artistes'
                                    onChange={handleChange}
                                    type="text" placeholder="art1;art2" />
                            </Form.Group>
                        </Form.Row>
                        <Form.Group controlId="formGridGroup">
                            <Form.Label>Groupe</Form.Label>
                            <Form.Control
                                readOnly={submit}
                                name='groupes'
                                onChange={handleChange}
                                type="text" placeholder="grp1;grp2" />
                        </Form.Group>

                        <Form.Group controlId="exampleForm.Control
                        readOnly={submit}Parole">
                            <Form.Label>Parole</Form.Label>
                            <Form.Control
                                readOnly={submit}
                                name='paroles'
                                onChange={handleChange}
                                as="textarea" rows="6" />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonGroup>
                            <Button 
                                size="sm" as={Link}
                                to='/advance?create=lyrics' 
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
