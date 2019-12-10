import React from 'react'
import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Session from "../Session/index"

export default function Navigation() {
    return (
        <Navbar className="mb-1" collapseOnSelect expand="lg" bg="light" >
            <Navbar.Brand href="/">React-Bootstrap</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <LinkContainer to="/">
                        <Nav.Link>Home</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/liste">
                        <Nav.Link>Liste</Nav.Link>
                    </LinkContainer>
                </Nav>
            </Navbar.Collapse>
            <Navbar.Collapse className="justify-content-end">
                <Session />
            </Navbar.Collapse>
        </Navbar>
    )
}
