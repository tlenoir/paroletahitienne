import React, { useState } from 'react'
import { Form, Col, Row } from 'react-bootstrap'
import Previewer from './components/Previewer/Previewer'
import TextareaAutosize from 'react-textarea-autosize'

export default function AvanceParole() {
    const [item, setItem] = useState({
        content: '',
        song: '',
        singer: '',
        composer: '',
        isEmbedChord: false
    })

    const handleEditorForm = (event) => {
        setItem({
            ...item,
            [event.target.name]: event.target.value
        })
    }

    return (
        <React.Fragment>
            <Row>
                <Col md>
                    <Form>
                        <Row>
                            <Form.Group as={Col} md controlId="exampleForm.ControlTitre">
                                <Form.Label>Titre</Form.Label>
                                <Form.Control
                                    name="song"
                                    onChange={handleEditorForm} />
                            </Form.Group>
                            <Form.Group as={Col} md controlId="exampleForm.ControlArtiste">
                                <Form.Label>Artiste</Form.Label>
                                <Form.Control
                                    name="singer"
                                    onChange={handleEditorForm} />
                            </Form.Group>
                            <Form.Group as={Col} md controlId="exampleForm.ControlArtiste">
                                <Form.Label>Groupe</Form.Label>
                                <Form.Control
                                    name="composer"
                                    onChange={handleEditorForm} />
                            </Form.Group>
                        </Row>
                        <Form.Group controlId="exampleForm.ControlTextareaParole">
                            <Form.Label>Parole</Form.Label>
                            <Form.Control
                                name="content"
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
        </React.Fragment >
    )
}
