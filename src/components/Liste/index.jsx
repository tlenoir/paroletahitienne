import React, { useState } from 'react'

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ListGroup, Alert, Spinner, Form, Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';


export default function Liste() {
    const [value, loading, error] = useCollection(
        firebase.firestore().collection('paroles'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );
    return (
        <div>
            <AjoutParole />
            {error && <Alert variant="danger">Erreur: {error}</Alert>}
            {loading && <Spinner animation="grow" variant="primary"></Spinner>}
            {value && (
                <ListGroup variant="flush">
                    {value.docs.map(doc => (
                        <ListGroup.Item variant="light" as={Link}
                            to={`/liste=${doc.id}`} key={doc.id}>
                            {doc.data().titre}
                        </ListGroup.Item>
                    ))}
                </ListGroup>)}
        </div>
    );
}

function AjoutParole() {
    const [user] = useAuthState(firebase.auth())
    const [show, setShow] = useState(false);
    const [error, setError] = useState("")
    const [item, setItem] = useState({
        titre: "",
        parole: "",
    });

    const handleChange = (e) => {
        setItem({
            ...item,
            [e.target.name]: e.target.value
        })
    }

    const handleShow = () => {
        if (user)
            setShow(true)
        else
            setError("Vous devez être authentifier pour pouvoir ajouter des paroles!")

    };
    const handleClose = (e) => {
        e.preventDefault()
        e.stopPropagation();
        firebase.firestore().collection('paroles').doc().set({
            ...item,
            date: firebase.firestore.Timestamp.fromDate(new Date()),
            uid: user.uid
        })
        setShow(false)
    };
    return (
        <div>
            <Button variant="primary" onClick={handleShow}>
                Ajouter une chanson
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter une nouvelle chanson</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleClose}>
                    <Modal.Body>
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Titre</Form.Label>
                            <Form.Control name="titre" value={item.titre} onChange={handleChange} type="text" placeholder="Parole Tahitienne" />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Example textarea</Form.Label>
                            <Form.Control name="parole" value={item.parole} onChange={handleChange} as="textarea" rows="3" />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Annuler
                    </Button>
                        <Button variant="primary" type="submit">
                            Sauvegarder
                    </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {error && <Alert variant="danger">{error}</Alert>}
        </div >
    )

}