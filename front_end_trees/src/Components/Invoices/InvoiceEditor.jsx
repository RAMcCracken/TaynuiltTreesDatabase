import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import InvoiceForm from './InvoiceForm'
const util = require("../../Utils")

class InvoiceEditor extends Component {
    constructor(props) {
        super(props)
        const data = this.props.location && this.props.location.state ?
            this.props.location.state.data : null
        let inv_date = ""
        let date_pd = ""
        if (data) {
            if (data.invoice_date) {
                inv_date = new Date(Date.parse(data.invoice_date))
            }
            if (data.date_paid) {
                date_pd = new Date(Date.parse(data.date_paid))
            }

        }

        this.state = {
            old_invoice_no: data ? data.invoice_no : "",
            invoice_no: data ? data.invoice_no : "",
            invoice_date: data ? inv_date : "",
            discount: data ? data.discount : 0,
            vat: data ? data.vat : 20,
            paid: data ? data.paid : false,
            payment_method: data ? data.payment_method : "",
            date_paid: data ? date_pd : "",
            order_no: data ? data.order_no : "",
            delivery_ref: data ? data.delivery_ref : "",
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

    handleInvoiceDateChange = e => {
        this.setState({
            invoice_date: e
        })
    }

    handleDatePaidChange = e => {
        this.setState({
            date_paid: e
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
        this.props.history.push("/invoices");
    }

    handleSubmit = e => {
        e.preventDefault();
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                invoice_no: this.state.invoice_no,
                invoice_date: util.formatDate(this.state.invoice_date),
                discount: this.state.discount,
                vat: this.state.vat,
                payment_method: this.state.payment_method ? this.state.payment_method : null,
                paid: this.state.paid,
                date_paid: this.state.date_paid ? util.formatDate(this.state.date_paid) : null,
                order_no: this.state.order_no,
                delivery_ref: this.state.delivery_ref ? this.state.delivery_ref : null,
            }
        }
        requestOptions.body = JSON.stringify(requestOptions.body);
        fetch('/api/invoice/' + this.state.old_invoice_no, requestOptions)
            .then(response => {
                if (response.ok) {
                    e.target.reset();
                    this.setState({
                        error: null
                    })
                    this.props.history.push("/invoices");
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
        const { invoice_no, invoice_date, discount, vat, payment_method, paid, date_paid, order_no, delivery_ref } = this.state
        return (
            <Card className='m-4' >
                <Card.Title className='m-4'>Edit Invoice {this.state.old_invoice_no}</Card.Title>
                {this.state.error ? <h5 className="text-danger">{this.state.error}</h5> : <div />}
                <Card.Body className="d-flex flex-row justify-content-center">
                    <Form className="w-50" onSubmit={this.handleSubmit}>
                        <InvoiceForm
                            invoice_no={invoice_no}
                            invoice_date={invoice_date}
                            discount={discount}
                            vat={vat}
                            payment_method={payment_method}
                            paid={paid}
                            date_paid={date_paid}
                            order_no={order_no}
                            delivery_ref={delivery_ref}
                            handleChange={this.handleChange.bind(this)}
                            handleDatePaidChange={this.handleDatePaidChange.bind(this)}
                            handleInvoiceDateChange={this.handleInvoiceDateChange.bind(this)}
                            handleSubmit={this.handleSubmit.bind(this)}
                            handleOptionChange={this.handleOptionChange.bind(this)}
                            handleCancel={this.handleCancel.bind(this)}
                        ></InvoiceForm>

                    </Form>
                </Card.Body>
            </Card >)
    }
}

export default InvoiceEditor