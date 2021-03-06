import React from 'react';
import { NavDropdown, Container, Image } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import logo from '../ttreeslogo.png'


function Navigation() {
    return (
        <Navbar bg="light" expand="lg">
            <Container className="d-flex">
                <Navbar.Brand href="/" className="mb-2">
                    <img
                        alt=""
                        src={logo}
                        width="150"
                        height="75"
                        className="d-inline-block align-top"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <NavDropdown title="Quotes" id="quote-dropdown">
                            <NavDropdown.Item href="/quotes">Quote Data</NavDropdown.Item>
                            <NavDropdown.Item href="/new-quote">New Quote</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="/orders">Orders</Nav.Link>
                        <NavDropdown title="Invoices" id="invoice-dropdown">
                            <NavDropdown.Item href="/invoices">Invoice Data</NavDropdown.Item>
                            <NavDropdown.Item href="/new-invoice">New Invoice</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Deliveries" id="delivery-dropdown">
                            <NavDropdown.Item href="/deliveries">Delivery Data</NavDropdown.Item>
                            <NavDropdown.Item href="/new-delivery">New Delivery</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Customers" id="customer-dropdown">
                            <NavDropdown.Item href="/customers">Customer Data</NavDropdown.Item>
                            <NavDropdown.Item href="/new-customer">New Customer</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Navigation
