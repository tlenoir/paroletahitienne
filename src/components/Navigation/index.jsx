import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import routes from "../../constants/routes"

export default function App() {
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
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
            </Navbar.Collapse>
        </Navbar>
    )
}
