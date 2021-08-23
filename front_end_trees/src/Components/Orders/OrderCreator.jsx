import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import OrderForm from './OrderForm'

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
        this.setState({
            picked: e.target.value
        });
    };

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    handleSubmit = e => {
        e.preventDefault();
        console.log(this.formatDate(this.state.order_date));
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
                    ></OrderForm>
                </Card.Body>
            </Card >
        )
    }
}

export default OrderCreator