import React, { useContext, useState, useEffect } from 'react'
import { FirebaseContext } from "../../stores/Firebase"
import { ThemesContext } from "../../stores/Themes/index"

import { useParams } from 'react-router-dom'
import { Spinner, Breadcrumb, Alert, Form, Col, Card, } from 'react-bootstrap'
import TextareaAutosize from 'react-textarea-autosize'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faFileContract, faStar as faStarS } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarR } from '@fortawesome/free-regular-svg-icons'

import Previewer from "./AvanceParole/components/Previewer/Previewer"

export default function Parole() {
    const firebase = useContext(FirebaseContext)
    const themes = useContext(ThemesContext)
    const { id } = useParams()
    const [submitting, setSubmitting] = useState(true)
    const [mode, setMode] = useState(false)
    const [item, setItem] = useState({
        paroles: '',
        titre: '',
        artistes: '',
        groupes: '',
    })
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
        if (doc && doc.exists) {
            themes.updateTitle(doc.data().titre)
            setItem({
                titre: doc.data().titre,
                paroles: doc.data().paroles,
                artistes: doc.data().artistes.join(';'),
                groupes: doc.data().groupes.join(';')
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
            content: doc.data().paroles,
            singer: doc.data().artistes,
            composer: doc.data().groupes,
            song: doc.data().titre
        })
        setMode(!mode)
    }

    const handleFavoris = () => {
        firebase.addFavoris(doc.ref.path)
    }

    return (
        <React.Fragment>
            {error && <Alert variant="danger">Erreur: {error.message}</Alert>}
            {loading && <Spinner animation="grow" variant="primary" />}
            {doc && doc.exists &&
                <Card>
                    <Breadcrumb>
                        <Breadcrumb.Item
                            onClick={handleEdit}>
                            {submitting ?
                                <span>
                                    Editée <FontAwesomeIcon size="lg" icon={faEdit} />
                                </span> :
                                'Annulé'}
                        </Breadcrumb.Item>
                        <Breadcrumb.Item
                            onClick={handleMode}>
                            Affichage {mode ? 'Compositeur ' : 'simple '}
                            <FontAwesomeIcon size="lg" icon={faFileContract} />
                        </Breadcrumb.Item>
                        {firebase.user &&
                            <Breadcrumb.Item
                                onClick={handleFavoris}>
                                {doc.data().favoris && doc.data().favoris.find(element => element === firebase.user.uid) ?
                                    <span><FontAwesomeIcon color='yellow' size="lg" icon={faStarS} /></span>
                                    :
                                    <span>Ajouter aux favoris <FontAwesomeIcon size="lg" icon={faStarR} /></span>}
                            </Breadcrumb.Item>}
                    </Breadcrumb>
                    <Card.Body>
                        {mode ?
                            <Previewer
                                isEdit={true}
                                headerForm={itemPreview}
                                editorForm={itemPreview} />
                            :
                            <Form>
                                <Form.Row>
                                    <Form.Group as={Col} md="4" controlId="exampleForm.ControlInputTitre">
                                        <Form.Label srOnly={submitting}>Titre</Form.Label>
                                        <Form.Control
                                            size="lg"
                                            value={item.titre}
                                            name="titre"
                                            plaintext={submitting}
                                            onChange={handleChange}
                                            readOnly={submitting} type="text" />
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" controlId="exampleForm.ControlInputArtiste">
                                        <Form.Label srOnly={submitting}>Artiste</Form.Label>
                                        <Form.Control
                                            size="lg"
                                            value={item.artistes}
                                            name="artistes"
                                            plaintext={submitting}
                                            onChange={handleChange}
                                            readOnly={submitting} type="text" />
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" controlId="exampleForm.ControlInputGroupe">
                                        <Form.Label srOnly={submitting}>Groupe</Form.Label>
                                        <Form.Control
                                            size="lg"
                                            value={item.groupes}
                                            name="groupes"
                                            plaintext={submitting}
                                            onChange={handleChange}
                                            readOnly={submitting} type="text" />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Group controlId="exampleForm.ControlTextareaParole">
                                    <Form.Label srOnly={submitting}>Parole</Form.Label>
                                    <Form.Control
                                        value={item.paroles}
                                        name="paroles"
                                        plaintext={submitting}
                                        onChange={handleChange}
                                        readOnly={submitting} as={TextareaAutosize} />
                                </Form.Group>
                            </Form>
                        }
                    </Card.Body>
                </Card>
            }
            {doc && !doc.exists && <Alert variant="info">Ce document n'existe pas.</Alert>}
        </React.Fragment>
    )
}
