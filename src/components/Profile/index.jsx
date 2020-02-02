import React, { useContext } from 'react'
import { FirebaseContext } from "../../stores/Firebase/index"
import Profile from "./profile"
import Favoris from "./favoris"
import Chansons from "./chansons"

import { Card, Alert, Row, Col, Nav, Tab, Badge } from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMusic, faListOl, faStar, faUser, faBell } from '@fortawesome/free-solid-svg-icons'


export default function Profiles() {

    const firebase = useContext(FirebaseContext)
    const user = firebase.user
    return (
        <React.Fragment>
            <Tab.Container id="left-tabs-example" defaultActiveKey="third">
                <Row>
                    <Col md={3}>
                        <Nav variant="tabs" className="flex-md-column mb-1">
                            <Nav.Item>
                                <Nav.Link eventKey="first">
                                    <FontAwesomeIcon icon={faMusic} />
                                    <FontAwesomeIcon icon={faListOl} />
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="second">
                                    <FontAwesomeIcon icon={faStar} />
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <NotificationBadge uid={user.uid} />
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="third">
                                    <FontAwesomeIcon icon={faUser} />
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col md={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="third">
                                <Profile uid={user.uid} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="first">
                                <Chansons uid={user.uid} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="second">
                                <Favoris uid={user.uid} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="four">
                                <NotificationContent uid={user.uid} />
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </React.Fragment>
    )

}

function NotificationBadge({ uid }) {

    const firebase = useContext(FirebaseContext)

    const [value] = firebase.useCollection(
        firebase.firestore().collection(`notifications/${uid}/chansons`),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        })

    return (
        <Nav.Link eventKey="four">
            <FontAwesomeIcon icon={faBell} />
            {value && value.size > 0 &&
                <Badge className="float-right" variant="info">{value.size}</Badge>
            }
        </Nav.Link>
    )
}

function NotificationContent({ uid }) {

    const firebase = useContext(FirebaseContext)

    const [value] = firebase.useCollection(
        firebase.firestore().collection(`notifications/${uid}/chansons`),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        })

    return (
        <div>
            <Card className="mb-3" body>Notifications</Card>
            {value && value.size > 0 && <div>
                <Alert variant="info">Chansons Re-editées {value.size}</Alert>
                {value.docs.map((doc) => (
                    <Row key={doc.id}>
                        <Col md={6}>
                            <pre>{doc.data().parole}</pre>
                        </Col>
                        <Col md={6}>
                            <pre>{doc.data().parole2}</pre>
                        </Col>
                    </Row>
                ))}
            </div>}
        </div>
    )
}
