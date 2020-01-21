import React, { useContext, useReducer } from 'react'
import { FirebaseContext } from "../../stores/Firebase/index"
import { ThemesContext } from "../../stores/Themes/index"
import AjoutParole from "./ajouter"

import { useHistory } from 'react-router-dom'
import { Spinner, Alert, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

import { initialState, reducer } from "../../reducers/reducers"

export default function Liste() {
    const firebase = useContext(FirebaseContext)
    const themes = useContext(ThemesContext)
    themes.updateTitle('Liste des chansons polynésiennes')
    const history = useHistory()

    const [state, dispatch] = useReducer(reducer, initialState)

    const [docs, loading, error] = firebase.useCollection(
        firebase.firestore().collection('chansons').orderBy(state.orderBy),
        {
            snapshotListenOptions: { includeMetadataChanges: true }
        }
    )

    const handleShowSong = (event, id) => {
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
                                <th onClick={() => dispatch({ type: 'titre' })}>Titre</th>
                                <th onClick={() => dispatch({ type: 'artiste' })}>Artiste</th>
                                <th onClick={() => dispatch({ type: 'groupe' })}>Groupe</th>
                                <th className="d-none d-sm-block" onClick={() => dispatch({ type: 'date' })}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {docs.docs.map((doc, i) => (
                                <tr key={doc.id} onClick={(e) => handleShowSong(e, doc.id)}>
                                    <td>{i + 1}</td>
                                    <td>
                                        {doc.data().titre}
                                        {
                                            firebase.user && doc.data().favoris && doc.data().favoris.find(element => element === firebase.user.uid)
                                            &&
                                            <FontAwesomeIcon icon={faStar} color='yellow' pull='right' />
                                        }
                                    </td>
                                    <td>{doc.data().artistes.join(';')}</td>
                                    <td>{doc.data().groupes.join(';')}</td>
                                    <td className="d-none d-sm-block">{doc.data().date_ajout}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

