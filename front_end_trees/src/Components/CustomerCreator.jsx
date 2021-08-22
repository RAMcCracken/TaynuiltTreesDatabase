import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import { DashCircle, PlusCircle } from 'react-bootstrap-icons'
import { Col, Row } from 'react-bootstrap'


function CustomerCreator() {

    let history = useHistory();

    const [phoneFields, setPhoneFields] = useState([{
        id: 1,
        number: ""
    }])

    const [custref, setCustRef] = useState("");
    const [firstname, setFirstName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [address3, setAddress3] = useState("");
    const [address4, setAddress4] = useState("");


    const handleChangePhone = (i, e) => {
        const values = [...phoneFields]
        values[i][e.target.name] = e.target.value
        setPhoneFields(values)
    }

    const handleAdd = (id) => {
        setPhoneFields([...phoneFields, { id: id + 2, number: "" }])
    }

    const handleSubtract = (i) => {
        const values = [...phoneFields]
        values.splice(i, 1)
        setPhoneFields([...values])
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(phoneFields);
        let phoneNums = []

        phoneFields.forEach(element => {
            console.log(element.number)
            const number = [custref, element.number]
            phoneNums = [...phoneNums, number]
        });

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                customer_ref: custref,
                firstname: firstname,
                surname: surname,
                email: email,
                company: company,
                address_number: address1,
                address_street: address2,
                address_town: address3,
                address_postcode: address4,
                phone_numbers: phoneNums
            }
        };
        console.log(requestOptions);
        requestOptions.body = JSON.stringify(requestOptions.body);
        fetch('/api/customer', requestOptions)
            .then(response => {
                response.json();
                if (response.ok) {
                    e.target.reset();
                    history.push("/customers");
                }
            })


    }

    return (
        <Card className='m-4'>
            <Card.Title className='mt-4'>Add New Customer</Card.Title>
            <Card.Body className="d-flex flex-row justify-content-center">
                <Form className="w-50" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="customer_ref">
                        <Form.Label className="d-flex align-self-left">Customer Reference</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="e.g C123"
                            value={custref}
                            onChange={e => setCustRef(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="name">
                        <Row>
                            <Col>
                                <Form.Label className="d-flex align-self-left">First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="First Name"
                                    value={firstname}
                                    onChange={e => setFirstName(e.target.value)}
                                />
                            </Col>
                            <Col>
                                <Form.Label className="d-flex align-self-left">Surname</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Surname"
                                    value={surname}
                                    onChange={e => setSurname(e.target.value)}
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label className="d-flex align-self-left">Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Customer Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="company">
                        <Form.Label className="d-flex align-self-left">Company</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Customer Company"
                            value={company}
                            onChange={e => setCompany(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Text>Address</Form.Text>
                    <Form.Group className="mb-3" controlId="address1">
                        <Row>
                            <Col>
                                <Form.Label className="d-flex align-self-left">Address 1</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="House Name/Number"
                                    value={address1}
                                    onChange={e => setAddress1(e.target.value)}
                                />
                            </Col>
                            <Col>
                                <Form.Label className="d-flex align-self-left">Address 2</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Street Name"
                                    value={address2}
                                    onChange={e => setAddress2(e.target.value)}
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
                                    placeholder="Town"
                                    value={address3}
                                    onChange={e => setAddress3(e.target.value)}
                                />
                            </Col>
                            <Col xs={4}>
                                <Form.Label className="d-flex align-self-left">Post Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Post Code"
                                    value={address4}
                                    onChange={e => setAddress4(e.target.value)}
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Text>Phone Numbers</Form.Text>
                    <Form.Group className="mb-3" controlId="phone1">
                        {phoneFields.map((field, i) => (
                            <div key={field.id}>
                                <Row>
                                    <Col xs={10}>
                                        <Form.Label className="d-flex align-self-left">Phone Number</Form.Label>
                                        <Form.Control
                                            type="tel"
                                            placeholder="Work or Mobile Number"
                                            name="number"
                                            value={field.number}
                                            onChange={e => handleChangePhone(i, e)}
                                        />
                                    </Col>
                                    <Col xs={1} className="d-flex flex-col align-self-end">
                                        <Button onClick={() => handleAdd(i)}><PlusCircle></PlusCircle></Button>
                                    </Col>
                                    <Col xs={1} className="d-flex flex-col align-self-end">
                                        <Button className="mt-4" disabled={field.id === 1} onClick={() => handleSubtract(i)}><DashCircle></DashCircle></Button>
                                    </Col>
                                </Row>
                            </div>
                        ))}
                    </Form.Group>
                    <Button
                        variant='danger'
                        className='m-2'
                    >Cancel</Button>
                    <Button variant='success' className='m-2' type="submit">Save</Button>
                </Form>
            </Card.Body>
        </Card >
    )

}

export default CustomerCreator