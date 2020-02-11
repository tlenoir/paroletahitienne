import React, { useContext, useState, useEffect } from 'react'
import { FirebaseContext } from "../../stores/Firebase"
import { ThemesContext } from "../../stores/Themes/index"

import { useParams, useHistory } from 'react-router-dom'
import { Spinner, Breadcrumb, Alert, Card, } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit,faStar as faStarS } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarR } from '@fortawesome/free-regular-svg-icons'

import Previewer from "./AvanceParole/components/Previewer/Previewer"

export default function Parole() {
    const firebase = useContext(FirebaseContext)
    const themes = useContext(ThemesContext)
    const { id } = useParams()
    const history = useHistory()

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

    useEffect(() => {
        if (doc && doc.exists) {
            themes.updateTitle(doc.data().titre)
            setItemPreview({
                content: doc.data().paroles,
                singer: doc.data().artistes,
                composer: doc.data().groupes,
                song: doc.data().titre
            })
        }
        else
            themes.updateTitle('Pas de chanson!')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [doc])

    const handleEdit = () => {
        history.push(`/edit=${id}`)
    }

    const handleAddFavorite = () => {
        firebase.addFavoris(doc.ref.path)
    }

    const handleRemoveFavorite = () => {
        firebase.removeFavoris(doc.ref.path)
    }

    return (
        <React.Fragment>
            {error && <Alert variant="danger">Erreur: {error.message}</Alert>}
            {loading && <Spinner animation="grow" variant="primary" />}
            {doc && doc.exists &&
                <Card>
                    <Breadcrumb>
                        <Breadcrumb.Item onClick={handleEdit}>
                            { doc.data().canEdit && <span>Editée <FontAwesomeIcon size="lg" icon={faEdit} /></span>}
                        </Breadcrumb.Item>
                        {firebase.user &&
                            <Breadcrumb.Item>
                                {
                                    doc.data().favoris
                                        && doc.data().favoris.find(element => element === firebase.user.uid)
                                        ?
                                        <span onClick={handleRemoveFavorite}>Supprimer des favoris <FontAwesomeIcon color='yellow' size="lg" icon={faStarS} /></span>
                                        :
                                        <span onClick={handleAddFavorite}>Ajouter aux favoris <FontAwesomeIcon size="lg" icon={faStarR} /></span>
                                }
                            </Breadcrumb.Item>}
                    </Breadcrumb>
                    <Card.Body>
                        <Previewer
                            isEdit={true}
                            headerForm={itemPreview}
                            editorForm={itemPreview} />
                    </Card.Body>
                </Card>
            }
            {doc && !doc.exists && <Alert variant="info">Ce document n'existe pas.</Alert>}
        </React.Fragment>
    )
}
