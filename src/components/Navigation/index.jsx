import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import routes from "../../constants/routes"
import Session from "../Session/index"
import { RechercheForm } from "../Recherche/index"

export default function Navigation() {
    return (
        <Navbar className="mb-2" collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="/">Parole Héritage</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    {routes.map(route => (
                        <LinkContainer key={route.path} to={route.path}>
                            <Nav.Link >{route.name}</Nav.Link>
                        </LinkContainer>
                    ))}
                </Nav>
                <RechercheForm />
                <Session />
            </Navbar.Collapse>
        </Navbar>
    )
}
