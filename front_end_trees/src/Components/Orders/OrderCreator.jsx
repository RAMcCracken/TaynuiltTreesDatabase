import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import OrderForm from './OrderForm'
const util = require("../../Utils")

class OrderCreator extends Component {
    constructor(props) {
        super(props)
        this.state = {
            order_no: "",
            order_date: "",
            credit_period: 0,
            picked: false,
            location: "",
            stock_reserve: false,
            customer_po: "",
            quote_ref: "",
            customer_ref: "",
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


    handleSubmit = e => {
        e.preventDefault();
        console.log(this.state.customer_po);
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                order_no: this.state.order_no,
                order_date: util.formatDate(this.state.order_date),
                credit_period: this.state.credit_period,
                picked: this.state.picked,
                location: this.state.location,
                stock_reserve: this.state.stock_reserve,
                customer_po: this.state.customer_po,
                quote_ref: this.state.quote_ref,
                customer_ref: this.state.customer_ref,
            }
        }
        requestOptions.body = JSON.stringify(requestOptions.body);
        fetch('/api/order', requestOptions)
            .then(response => {
                if (response.ok) {
                    e.target.reset();
                    this.props.history.push("/orders");
                } else {
                    return response.json().then((error) => {
                        let err = error.message
                        throw new Error(err);
                    })
                }
            })
            .catch(error => {
                this.setState({ error: error.message, loading: false })
            });
    }

    render() {
        const { order_no, order_date, credit_period, picked, location, stock_reserve, customer_po, quote_ref, customer_ref } = this.state
        return (
            <Card className='m-4' >
                <Card.Title className='mt-4'>Add New Order</Card.Title>
                <Card.Body className="d-flex flex-row justify-content-center">
                    <OrderForm
                        order_no={order_no}
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
                    ></OrderForm>
                </Card.Body>
            </Card >
        )
    }
}

export default OrderCreator