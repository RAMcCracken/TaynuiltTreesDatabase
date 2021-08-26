import React from 'react'
import Form from 'react-bootstrap/Form'
import { DashCircle, PlusCircle } from 'react-bootstrap-icons'
import { Col, Row } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import DatePicker from 'react-date-picker'

function InvoiceForm(props) {
    return (
        <div>
            <Form.Group className="mb-3" controlId="invoice_no">
                <Row>
                    <Col>
                        <Form.Label className="d-flex align-self-left">Invoice Number</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="e.g I123"
                            value={props.invoice_no}
                            name="invoice_no"
                            onChange={e => props.handleChange(e)}
                        />
                    </Col>
                </Row>

            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
                <Row>
                    <Col xs={12} md={8}>
                        <Form.Label className="d-flex align-self-left">Invoice Date</Form.Label>
                        <DatePicker
                            name="invoice_date"
                            value={props.invoice_date}
                            onChange={e => props.handleInvoiceDateChange(e)}
                        ></DatePicker>
                    </Col>
                    <Col xs={12} md={4}>
                        <Form.Label className="d-flex align-self-left">Discount (%)</Form.Label>
                        <Form.Control
                            type="number"
                            name="discount"
                            placeholder="Discount (%)"
                            value={props.discount}
                            onChange={e => props.handleChange(e)}
                        />
                    </Col>

                </Row>
            </Form.Group>
            <Form.Group className="mb-3" controlId="Payment">
                <Row>
                    <Col xs={12} md={8}>
                        <Form.Label className="d-flex align-self-left">VAT (%)</Form.Label>
                        <Form.Control
                            type="number"
                            name="vat"
                            placeholder="VAT (%)"
                            value={props.vat}
                            onChange={e => props.handleChange(e)}
                        />
                    </Col>

                    <Col xs={12} md={4}>
                        <Row className="mt-3">
                            <Form.Check
                                type="checkbox"
                                name="paid"
                                checked={props.paid}
                                label="Paid"
                                value={props.paid}
                                onChange={e => props.handleOptionChange(e)}
                            />
                        </Row>
                    </Col>

                </Row>
            </Form.Group>
            <Form.Group className="mb-3" controlId="stock">
                <Row>
                    <Col xs={12} xs={6}>
                        <Form.Label className="d-flex align-self-left">Payment_Method</Form.Label>
                        <Form.Control
                            type="text"
                            name="payment_method"
                            placeholder="Payment Method (bacs, cheque, cash)"
                            value={props.payment_method}
                            onChange={e => props.handleChange(e)}
                        />
                    </Col>
                    <Col xs={12} md={8}>
                        <Form.Label className="d-flex align-self-left">Date Paid</Form.Label>
                        <DatePicker
                            name="date_paid"
                            value={props.date_paid}
                            onChange={e => props.handleDatePaidChange(e)}
                        ></DatePicker>
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group className="mb-3" controlId="order_no">
                <Row>
                    <Col>
                        <Form.Label className="d-flex align-self-left">Order Number</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="e.g O123"
                            value={props.order_no}
                            name="order_no"
                            onChange={e => props.handleChange(e)}
                        />
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Label className="d-flex align-self-left">Delivery Ref</Form.Label>
                        <Form.Control
                            type="text"
                            name="delivery_ref"
                            placeholder="Delivery Ref"
                            value={props.delivery_ref}
                            onChange={e => props.handleChange(e)}
                        />
                    </Col>
                </Row>

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

export default InvoiceForm
