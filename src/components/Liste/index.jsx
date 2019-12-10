import './style.css'
import React, { useState, useEffect } from 'react'

import firebase, { firestore } from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ListGroup, Alert, Spinner, Form, Modal, Button, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faPlus } from '@fortawesome/free-solid-svg-icons';


export default function Liste() {

    const [user] = useAuthState(firebase.auth())

    const [value, loading, error] = useCollection(
        firebase.firestore().collection('paroles'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    )

    return (
        <div>
            {error && <Alert variant="danger">Erreur: {error}</Alert>}
            {loading && (
                <Spinner animation="grow" variant="primary" ></Spinner>
            )
            }
            {
                value && (
                    <div>
                        <AjoutParole />
                        <ListGroup variant="flush">
                            {value.docs.map((doc) => (
                                <ListGroup.Item variant="light" as={Link}
                                    to={`/liste=${doc.id}`} key={doc.id}>
                                    {doc.data().titre}
                                    {user && !user.isAnonymous &&
                                        <AjouterFavoris data={{
                                            id: doc.id,
                                            titre: doc.data().titre,
                                            artiste: doc.data().artiste,
                                            createBy: doc.data().createBy
                                        }} uid={user.uid} />
                                    }
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                )
            }
        </div >
    );
}

function AjoutParole() {

    const [user] = useAuthState(firebase.auth())
    const [show, setShow] = useState(false);
    const [item, setItem] = useState({
        titre: "",
        artiste: "",
        parole: "",
    });
    const [validated, setValidated] = useState(false);

    const handleChange = (e) => {
        setItem({
            ...item,
            [e.target.name]: e.target.value
        })
    }

    const handleShow = () => {
        setShow(!show)

    };

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity()) {
            firestore().collection('paroles').add({
                ...item,
                createAt: firebase.firestore.Timestamp.fromDate(new Date()),
                uid: user ? user.uid : 'anonymous',
                createBy: user ? user.displayName : 'anonymous'
            }).then((ref) => {
                if (user) {
                    firestore().collection(`users/${user.uid}/chansons`).add({
                        id: ref.id,
                        createAt: firebase.firestore.Timestamp.fromDate(new Date()),
                        titre: item.titre,
                        artiste: item.artiste
                    }).then(() => {
                        setItem({
                            titre: "",
                            artiste: "",
                            parole: "",
                        })
                        setValidated(false)
                    })
                }
            })
            setShow(false)
        } else
            setValidated(true);
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <div>
            <Button variant="link" onClick={handleShow}>
                <FontAwesomeIcon className="mr-1" icon={faPlus} size="lg" />
                Ajouter une chanson
            </Button>

            <Modal show={show} onHide={handleShow}>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter une nouvelle chanson</Modal.Title>
                </Modal.Header>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Row>
                            <Form.Group as={Col} md="4" controlId="validationCustom01">
                                <Form.Label>Titre</Form.Label>
                                <Form.Control
                                    required
                                    name="titre"
                                    value={item.titre}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="titre parole tahitienne"
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="8" controlId="validationCustom02">
                                <Form.Label>Artiste</Form.Label>
                                <Form.Control
                                    required
                                    name="artiste"
                                    value={item.artiste}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="artiste parole tahitienne"
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Parole</Form.Label>
                            <Form.Control
                                required
                                name="parole"
                                value={item.parole}
                                onChange={handleChange}
                                as="textarea" rows="5" />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Form.Group>
                            <Form.Check
                                required
                                label="Agree to terms and conditions"
                                feedback="You must agree before submitting."
                            />
                        </Form.Group>
                        <Button variant="secondary" onClick={handleShow}>
                            Annuler
                        </Button>
                        <Button variant="primary" type="submit">
                            Sauvegarder
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div >
    )

}

function AjouterFavoris({ data, uid }) {

    const favsPath = `users/${uid}/favorites`

    const [state, setState] = useState(false);
    const [refFavUser, setRefFavUser] = useState('');

    useEffect(() => {
        firestore().collection(favsPath)
            .where("id", "==", data.id).get()
            .then(data => {
                if (data.size) {
                    setState(true)
                    setRefFavUser(data.docs[0].ref.path)
                }
            })
    });

    const handleFavorite = (event) => {
        if (!state) {
            firestore().collection(favsPath).add(data)
            setState(true)
        }
        else {
            firestore().doc(refFavUser).delete()
            setState(false)
            setRefFavUser('')
        }
        event.stopPropagation()
        event.preventDefault()
    }

    return (
        <FontAwesomeIcon
            icon={faStar}
            pull="right"
            size="lg"
            onClick={handleFavorite}
            color={state ? 'green' : ''}
        />
    )
}