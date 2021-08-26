import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import { Row, Col } from 'react-bootstrap'
import OrderForm from '../Orders/OrderForm'
const util = require("../../Utils")

class QuoteCreator extends Component {
    constructor(props) {
        super(props)

        this.state = {
            quote_ref: "",
            quote_number: "",
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

    handleDateChange = e => {
        console.log(util.formatDate(e));
        this.setState({
            order_date: e
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
                quote_number: this.state.quote_number,
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
        const { quote_number, quote_confirmed, order_date, credit_period, picked, location, stock_reserve, customer_po, quote_ref, customer_ref } = this.state

        return (
            <Card className='m-4' >
                <Card.Title className='m-4'>Add New Quote</Card.Title>
                {this.state.error ? <h5 className="text-danger">{this.state.error}</h5> : <div />}
                <Card.Body className="d-flex flex-row justify-content-center">
                    <Form className="w-50" onSubmit={this.handleSubmit}>
                        <Row>
                            <Col xs={12} xs={6}>
                                <Form.Label className="d-flex align-self-left">Quote Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="quote_number"
                                    placeholder="Quote Number"
                                    value={quote_number}
                                    onChange={e => this.handleChange(e)}
                                />
                            </Col>
                        </Row>
                        <OrderForm
                            order_date={order_date}
                            credit_period={credit_period}
                            picked={picked}
                            location={location}
                            stock_reserve={stock_reserve}
                            customer_po={customer_po}
                            quote_ref={quote_ref}
                            customer_ref={customer_ref}
                            handleChange={this.handleChange.bind(this)}
                            handleDateChange={this.handleDateChange.bind(this)}
                            handleSubmit={this.handleSubmit.bind(this)}
                            handleOptionChange={this.handleOptionChange.bind(this)}
                            handleCancel={this.handleCancel.bind(this)}
                        ></OrderForm>

                    </Form>
                </Card.Body>
            </Card >
        )
    }
}

export default QuoteCreator