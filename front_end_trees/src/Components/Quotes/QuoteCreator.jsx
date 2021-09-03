import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import { Row, Col } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import DatePicker from 'react-date-picker'
const util = require("../../Utils")

class QuoteCreator extends Component {
    constructor(props) {
        super(props)

        this.state = {
            quote_ref: "",
            notes: "",
            order_date: "",
            credit_period: null,
            picked: false,
            location: "",
            stock_reserve: false,
            customer_po: "",
            quote_ref: "",
            customer_ref: "",
            quote_confirmed: false,
            error: null,
        }
    }

    handleChange = e => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value,
        });
    };

    handleDateChange = date => {
        console.log(util.formatDate(date));
        this.setState({
            order_date: date
        })
    }

    handleOptionChange = e => {
        const target = e.target;
        const value = target.checked;
        const name = target.name;
        this.setState({
            [name]: value
        });
    };

    handleCancel() {
        this.props.history.push("/quotes");
    }

    handleSubmit = e => {
        e.preventDefault();
        console.log(this.state.customer_po);
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                notes: this.state.notes,
                order_date: this.state.order_date ? util.formatDate(this.state.order_date) : util.formatDate(new Date()),
                credit_period: this.state.credit_period,
                picked: this.state.picked,
                location: this.state.location,
                stock_reserve: this.state.stock_reserve,
                customer_po: this.state.customer_po,
                customer_ref: this.state.customer_ref,
            }
        }
        requestOptions.body = JSON.stringify(requestOptions.body);
        fetch('/api/quote', requestOptions)
            .then(response => {
                if (response.ok) {
                    e.target.reset();
                    this.setState({
                        error: null
                    })
                    this.props.history.push("/quotes");
                } else {
                    return response.json().then((error) => {
                        let err = error.sql_err
                        throw new Error(err);
                    })
                }
            })
            .catch(error => {
                this.setState({ error: error.message, loading: false })
            });
    }


    render() {
        const { notes, quote_confirmed, order_date, credit_period, picked, location, stock_reserve, customer_po, quote_ref, customer_ref } = this.state

        return (
            <Card className='m-4' >
                <Card.Title className='m-4'>Add New Quote</Card.Title>
                {this.state.error ? <h5 className="text-danger">{this.state.error}</h5> : <div />}
                <Card.Body className="d-flex flex-row justify-content-center">
                    <Form className="w-50" onSubmit={this.handleSubmit}>
                        <Row>
                            <Col xs={12} md={8}>
                                <Form.Label className="d-flex align-self-left">Date</Form.Label>
                                <DatePicker
                                    name="order_date"
                                    value={this.order_date}
                                    onChange={date => this.handleDateChange(date)}
                                ></DatePicker>
                            </Col>
                            <Col xs={12} md={4}>
                                <Form.Label className="d-flex align-self-left">Credit Period</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="credit_period"
                                    placeholder="Credit Period"
                                    value={this.credit_period}
                                    onChange={e => this.handleChange(e)}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} xs={6}>
                                <Form.Label className="d-flex align-self-left">Customer PO</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="customer_po"
                                    placeholder="Customer PO"
                                    value={this.customer_po}
                                    onChange={e => this.handleChange(e)}
                                />
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Label className="d-flex align-self-left">Customer Ref</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="customer_ref"
                                    placeholder="Customer Ref"
                                    value={this.customer_ref}
                                    onChange={e => this.handleChange(e)}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Label className="d-flex align-self-left">Notes</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="notes"
                                    placeholder="Notes"
                                    value={this.notes}
                                    onChange={e => this.handleChange(e)}
                                />
                            </Col>
                        </Row>
                        <Button
                            variant='danger'
                            className='m-2'
                            onClick={e => this.handleCancel(e)}
                        >Cancel</Button>
                        <Button variant='success' className='m-2' type="submit">Save</Button>

                    </Form>
                </Card.Body>
            </Card >
        )
    }
}

export default QuoteCreator