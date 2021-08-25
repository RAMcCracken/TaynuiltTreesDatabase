import React from 'react'
import Form from 'react-bootstrap/Form'
import { DashCircle, PlusCircle } from 'react-bootstrap-icons'
import { Col, Row } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import DatePicker from 'react-date-picker'

function OrderForm(props) {
    return (
        <Form className="w-50" onSubmit={props.handleSubmit}>
            <Form.Group className="mb-3" controlId="order_no">
                <Row>
                    <Col>
                        <Form.Label className="d-flex align-self-left">Order Number</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="e.g C123"
                            value={props.order_no}
                            name="order_no"
                            onChange={e => props.handleChange(e)}
                        />
                    </Col>
                </Row>

            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
                <Row>
                    <Col xs={12} md={8}>
                        <Form.Label className="d-flex align-self-left">Date</Form.Label>
                        {/* <Form.Control
                            type="text"
                            placeholder="Order Date"
                            name="order_date"
                            value={props.order_date}
                            onChange={e => props.handleChange(e)}
                        /> */}
                        <DatePicker
                            name="order_date"
                            value={props.order_date}
                            onChange={e => props.handleDateChange(e)}
                        ></DatePicker>
                    </Col>
                    <Col xs={12} md={4}>
                        <Row className="mt-3">
                            <Form.Check
                                type="checkbox"
                                name="picked"
                                checked={props.picked}
                                label="Picked"
                                value={props.picked}
                                onChange={e => props.handleOptionChange(e)}
                            />
                        </Row>
                        <Row className="mt-1">
                            <Form.Check
                                type="checkbox"
                                label="Stock Reserve"
                                name="stock_reserve"
                                checked={props.stock_reserve}
                                value={props.stock_reserve}
                                onChange={e => props.handleOptionChange(e)}
                            />
                        </Row>
                    </Col>

                </Row>
            </Form.Group>
            <Form.Group className="mb-3" controlId="Credit">
                <Row>
                    <Col xs={12} md={4}>
                        <Form.Label className="d-flex align-self-left">Credit Period</Form.Label>
                        <Form.Control
                            type="number"
                            name="credit_period"
                            placeholder="Credit Period"
                            value={props.credit_period}
                            onChange={e => props.handleChange(e)}
                        />
                    </Col>
                    <Col xs={12} md={8}>
                        <Form.Label className="d-flex align-self-left">Location</Form.Label>
                        <Form.Control
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={props.location}
                            onChange={e => props.handleChange(e)}
                        />
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group className="mb-3" controlId="stock">
                <Row>
                    <Col >
                        <Form.Label className="d-flex align-self-left">Customer PO</Form.Label>
                        <Form.Control
                            type="text"
                            name="customer_po"
                            placeholder="Customer PO"
                            value={props.customer_po}
                            onChange={e => props.handleChange(e)}
                        />
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group className="mb-3" controlId="quote">
                <Row>
                    <Col xs={12} md={6}>
                        <Form.Label className="d-flex align-self-left">Quote Ref</Form.Label>
                        <Form.Control
                            type="text"
                            name="quote_ref"
                            placeholder="Town"
                            value={props.quote_ref}
                            onChange={e => props.handleChange(e)}
                        />
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Label className="d-flex align-self-left">Customer Ref</Form.Label>
                        <Form.Control
                            type="text"
                            name="customer_ref"
                            placeholder="Customer Ref"
                            value={props.customer_ref}
                            onChange={e => props.handleChange(e)}
                        />
                    </Col>
                </Row>
            </Form.Group>
            <Button
                variant='danger'
                className='m-2'
            >Cancel</Button>
            <Button variant='success' className='m-2' type="submit">Save</Button>
        </Form>
    )
}

export default OrderForm
