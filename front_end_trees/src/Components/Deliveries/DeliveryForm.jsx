import React from 'react'
import Form from 'react-bootstrap/Form'
import { DashCircle, PlusCircle } from 'react-bootstrap-icons'
import { Col, Row } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import DatePicker from 'react-date-picker'

function DeliveryForm(props) {

    return (
        <div>
            <Form.Group className="mb-3" controlId="customer_ref">
                <Form.Label className="d-flex align-self-left">Delivery Reference</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="e.g D123"
                    value={props.delivery_ref}
                    name="delivery_ref"
                    onChange={e => props.handleChange(e)}
                />
            </Form.Group>
            <Form.Text>Delivery Address</Form.Text>
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
            <Form.Group className="mb-3" controlId="name">
                <Row>
                    <Col>
                        <Form.Label className="d-flex align-self-left">Dispatch Date</Form.Label>
                        <DatePicker
                            name="dispatch_date"
                            value={props.dispatch_date}
                            onChange={e => props.handleDateChange(e)}
                        ></DatePicker>
                    </Col>
                    <Col>
                        <Form.Label className="d-flex align-self-left">Site Reference</Form.Label>
                        <Form.Control
                            type="text"
                            name="site_ref"
                            placeholder="Site Reference"
                            value={props.site_ref}
                            onChange={e => props.handleChange(e)}
                        />
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group className="mb-3" controlId="bags">
                <Row>
                    <Col xs={12} md={6}>
                        <Form.Label className="d-flex align-self-left">Delivery Charge</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Delivery Charge"
                            name="delivery_charge"
                            value={props.delivery_charge}
                            onChange={e => props.handleChange(e)}
                        />
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Label className="d-flex align-self-left">Box/Bags Total</Form.Label>
                        <Form.Control
                            type="number"
                            name="box_bag_total"
                            placeholder="Boxes and Bags"
                            value={props.box_bag_total}
                            onChange={e => props.handleChange(e)}
                        />
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group className="mb-3" controlId="notes">
                <Form.Label className="d-flex align-self-left">Notes</Form.Label>
                <Form.Control
                    type="paragraph"
                    name="notes"
                    placeholder="Notes"
                    value={props.notes}
                    onChange={e => props.handleChange(e)}
                />
            </Form.Group>
            <Button
                variant='danger'
                className='m-2'
                onClick={e => props.handleCancel(e)}
            >Cancel</Button>
            <Button variant='success' className='m-2' type="submit">Save</Button>
        </div>
    )
}

export default DeliveryForm
