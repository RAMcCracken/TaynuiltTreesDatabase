import React from 'react'
import Form from 'react-bootstrap/Form'
import { DashCircle, PlusCircle } from 'react-bootstrap-icons'
import { Col, Row } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'

function CustomerForm(props) {

    return (
        <Form className="w-50" onSubmit={props.handleSubmit}>
            <Form.Group className="mb-3" controlId="customer_ref">
                <Form.Label className="d-flex align-self-left">Customer Reference</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="e.g C123"
                    value={props.custref}
                    name="custref"
                    onChange={e => props.handleChange(e)}
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
                <Row>
                    <Col>
                        <Form.Label className="d-flex align-self-left">First Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="First Name"
                            name="firstname"
                            value={props.firstname}
                            onChange={e => props.handleChange(e)}
                        />
                    </Col>
                    <Col>
                        <Form.Label className="d-flex align-self-left">Surname</Form.Label>
                        <Form.Control
                            type="text"
                            name="surname"
                            placeholder="Surname"
                            value={props.surname}
                            onChange={e => props.handleChange(e)}
                        />
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
                <Form.Label className="d-flex align-self-left">Email</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Customer Email"
                    name="email"
                    value={props.email}
                    onChange={e => props.handleChange(e)}
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="company">
                <Form.Label className="d-flex align-self-left">Company</Form.Label>
                <Form.Control
                    type="text"
                    name="company"
                    placeholder="Customer Company"
                    value={props.company}
                    onChange={e => props.handleChange(e)}
                />
            </Form.Group>
            <Form.Text>Address</Form.Text>
            <Form.Group className="mb-3" controlId="address1">
                <Row>
                    <Col>
                        <Form.Label className="d-flex align-self-left">Address 1</Form.Label>
                        <Form.Control
                            type="text"
                            name="address1"
                            placeholder="House Name/Number"
                            value={props.address1}
                            onChange={e => props.handleChange(e)}
                        />
                    </Col>
                    <Col>
                        <Form.Label className="d-flex align-self-left">Address 2</Form.Label>
                        <Form.Control
                            type="text"
                            name="address2"
                            placeholder="Street Name"
                            value={props.address2}
                            onChange={e => props.handleChange(e)}
                        />
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group className="mb-3" controlId="address2">
                <Row>
                    <Col xs={8}>
                        <Form.Label className="d-flex align-self-left">Town/City</Form.Label>
                        <Form.Control
                            type="text"
                            name="address3"
                            placeholder="Town"
                            value={props.address3}
                            onChange={e => props.handleChange(e)}
                        />
                    </Col>
                    <Col xs={4}>
                        <Form.Label className="d-flex align-self-left">Post Code</Form.Label>
                        <Form.Control
                            type="text"
                            name="address4"
                            placeholder="Post Code"
                            value={props.address4}
                            onChange={e => props.handleChange(e)}
                        />
                    </Col>
                </Row>
            </Form.Group>
            <Form.Text>Phone Numbers</Form.Text>
            <Form.Group className="mb-3" controlId="phone1">
                {props.phoneFields.map((field, i) => (
                    <div key={field.id}>
                        <Row>
                            <Col xs={10}>
                                <Form.Label className="d-flex align-self-left">Phone Number</Form.Label>
                                <Form.Control
                                    type="tel"
                                    placeholder="Work or Mobile Number"
                                    name="number"
                                    value={field.number}
                                    onChange={e => props.handleChangePhone(i, e)}
                                />
                            </Col>
                            <Col xs={1} className="d-flex flex-col align-self-end">
                                <Button onClick={() => props.handleAdd(i)}><PlusCircle></PlusCircle></Button>
                            </Col>
                            <Col xs={1} className="d-flex flex-col align-self-end">
                                <Button className="mt-4" disabled={field.id === 1} onClick={() => props.handleSubtract(i)}><DashCircle></DashCircle></Button>
                            </Col>
                        </Row>
                    </div>
                ))}
            </Form.Group>
            <Button
                variant='danger'
                className='m-2'
                onClick={e => props.handleCancel(e)}
            >Cancel</Button>
            <Button variant='success' className='m-2' type="submit">Save</Button>
        </Form>
    )
}

export default CustomerForm
