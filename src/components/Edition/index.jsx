import React, { useContext, useState, useEffect } from 'react'
import { FirebaseContext } from '../../stores/Firebase/index'
import { ThemesContext } from '../../stores/Themes/index'
import { useParams } from 'react-router-dom'
import { Form, Col, Row, Alert, Spinner, Button } from 'react-bootstrap'
import Previewer from '../Parole/AvanceParole/components/Previewer/Previewer'
import TextareaAutosize from 'react-textarea-autosize'
import moment from 'moment'
import 'moment/locale/fr'

export default function Edition() {
    const { id } = useParams()
    const firebase = useContext(FirebaseContext)
    const themes = useContext(ThemesContext)
    themes.updateTitle('Edité')
    const [doc, loading, error] = firebase.useDocument(
        firebase.firestore().doc(`chansons/${id}`),
    )
    const [item, setItem] = useState({
        content: '',
        song: '',
        singer: '',
        composer: '',
        isEmbedChord: false,
    })

    const [data, setData] = useState({})

    useEffect(() => {
        if (doc) {
            setItem({
                content: doc.data().paroles,
                song: doc.data().titre,
                singer: doc.data().artistes.length > 1 ? doc.data().artistes.join(' & ') : doc.data().artistes[0],
                composer: doc.data().groupes.length > 1 ? doc.data().groupes.join(' & ') : doc.data().groupes[0]
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [doc])

    const handleEditorForm = (event) => {
        setItem({
            ...item,
            [event.target.name]: event.target.value
        })
    }

    const handleUpdate = () => {
        setData({
            date_edit: moment().local('fr').format('LLL'),
            artistes: item.singer.split(' & '),
            groupes: item.composer.split(' & '),
            titre: item.song,
            paroles: item.content
        })
    }

    useEffect(() => {
        if (Object.entries(data).length)
            firebase.editParole(data, id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return (
        <React.Fragment>
            {error && <Alert variant="danger">Erreur: {error.message}</Alert>}
            {loading && <Spinner animation="grow" variant="primary"></Spinner>}
            {doc &&
                <Row>
                    <Col md>
                        <Form>
                            <Button variant="link" onClick={handleUpdate} >Enregistrer les modifications</Button>
                            <Row>
                                <Form.Group as={Col} md controlId="exampleForm.ControlTitre">
                                    <Form.Label>Titre</Form.Label>
                                    <Form.Control
                                        name="song"
                                        value={item.song}
                                        onChange={handleEditorForm} />
                                </Form.Group>
                                <Form.Group as={Col} md controlId="exampleForm.ControlArtiste">
                                    <Form.Label>Artiste</Form.Label>
                                    <Form.Control
                                        name="singer"
                                        value={item.singer}
                                        onChange={handleEditorForm} />
                                </Form.Group>
                                <Form.Group as={Col} md controlId="exampleForm.ControlArtiste">
                                    <Form.Label>Groupe</Form.Label>
                                    <Form.Control
                                        name="composer"
                                        value={item.composer}
                                        onChange={handleEditorForm} />
                                </Form.Group>
                            </Row>
                            <Form.Group controlId="exampleForm.ControlTextareaParole">
                                <Form.Label>Parole</Form.Label>
                                <Form.Control
                                    name="content"
                                    value={item.content}
                                    onChange={handleEditorForm}
                                    as={TextareaAutosize} />
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col md>
                        <Previewer
                            isEdit={true}
                            headerForm={item}
                            editorForm={item} />
                    </Col>
                </Row>
            }
        </React.Fragment >
    )
}
