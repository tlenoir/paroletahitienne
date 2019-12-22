import React, { useState, useContext, useEffect } from 'react'
import { FirebaseContext } from "../../stores/Firebase/index"
import CGU from "../CGU/index"

import { Form, Button, Col, Alert, Spinner, Modal } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import 'moment/locale/fr'

export default function SignUp() {

    const firebase = useContext(FirebaseContext)

    const history = useHistory()

    const [validated, setValidated] = useState(false);
    const [submit, setSubmit] = useState(false)
    const [error, setError] = useState("")
    const [show, setShow] = useState(false)
    const [register, setRegister] = useState({
        email: "",
        passwd: "",
        nom: "",
        prenom: "",
        utilsateur: "",
        ville: "",
        apropos: "",
        date_naissance: "",
    })


    const handleShowCondition = () => setShow(true)
    const handleClose = () => setShow(false)

    const handleChange = (event) => {
        setRegister({
            ...register,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;

        if (form.checkValidity()) {
            setRegister({
                ...register,
                date_creation: firebase.firestore.Timestamp.fromDate(new Date()),
                date_naissance: moment(register.date_naissance).local('fr').format("LL")
            })
            setSubmit(true)
        }
        setValidated(true);
        event.preventDefault();
    }

    useEffect(() => {
        if (submit) {
            firebase.doSignUpWithEmailAndPasswd(register)
                .then(() => {
                    setRegister({
                        email: "",
                        passwd: "",
                        nom: "",
                        prenom: "",
                        utilsateur: "",
                        ville: "",
                        apropos: "",
                        date_naissance: "",
                    })
                    setValidated(false)
                })
                .then(() => {
                    history.push('/')
                })
                .catch(e => {
                    setError(e.message)
                    setSubmit(false)
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submit])

    return (
        <Form className="mb-4" noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Row>
                <Form.Group as={Col} md="6" controlId="formGridEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control required name="email"
                        value={register.email} onChange={handleChange}
                        type="email" placeholder="parole@tahitienne.com" />
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="formGridMotdepasse">
                    <Form.Label>Mot de passe</Form.Label>
                    <Form.Control required name="passwd"
                        value={register.passwd} onChange={handleChange}
                        type="password" />
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} md="4" controlId="formGridNom">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control required name="nom"
                        value={register.nom} onChange={handleChange}
                        type="text" placeholder="Parole"
                    />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="formGridPrenom">
                    <Form.Label>Prénom</Form.Label>
                    <Form.Control required name="prenom"
                        value={register.prenom} onChange={handleChange}
                        type="text" placeholder="Tahitienne"
                    />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="formGridNaissance">
                    <Form.Label>Date de naisssance</Form.Label>
                    <Form.Control required name="date_naissance"
                        value={register.date_naissance} onChange={handleChange}
                        type="date"
                    />
                </Form.Group>
            </Form.Row>

            <hr />

            <Form.Row>
                <Form.Group as={Col} md="6" controlId="formGridUtilisateur">
                    <Form.Label>Nom utilisateur</Form.Label>
                    <Form.Control required name="utilsateur"
                        type="text"
                        value={register.utilsateur} onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="formGridville">
                    <Form.Label>Ville</Form.Label>
                    <Form.Control required name="ville"
                        value={register.ville} onChange={handleChange}
                        type="text" placeholder="Paea"
                    />
                </Form.Group>
            </Form.Row>

            <hr />

            <Form.Row>
            </Form.Row>

            <Form.Group as={Col} controlId="formGridApropos">
                <Form.Label>À propos</Form.Label>
                <Form.Control
                    name="apropos"
                    as="textarea"
                    value={register.apropos} onChange={handleChange}
                />
            </Form.Group>

            <Form.Group id="formGridCheckbox">
                <Button variant="link"
                    onClick={handleShowCondition} size="sm">
                    conditions d'utilisation
                </Button>
                <Form.Check required className="text-left" type="checkbox" label="J'accepte" />
            </Form.Group>

            <Button variant={submit ? 'link' : 'primary'} type="submit" disabled={submit}>
                {submit ? <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                /> : 'Inscription'}
            </Button>
            {error && <Alert className="mt-2" variant="danger">{error}</Alert>}

            <Modal scrollable show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Parole Héritage</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CGU />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Form>
    )
}
