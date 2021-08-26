import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import DeleteConfirmation from '../DeleteConfirmation'
const util = require("../../Utils")

class InvoiceViewer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            selectedInvoice: "",
            error: null,
            loading: true,
            showDeleteConf: false,

        }
    }

    componentDidMount() {
        this.fetchInvoiceData();
    }

    fetchInvoiceData() {
        fetch('/api/invoice')
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    let err = "Problem occurred fetching invoice data"
                    throw new Error(err);
                }
            })
            .then(data => {
                this.setState({ data: data, loading: false, error: null })
            })
            .catch(error => {
                this.setState({ error: error.message, loading: false })
            });
    }

    handleOptionChange = e => {
        this.setState({
            selectedInvoice: e.target.value
        });
    };

    handleDelete = e => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch('/api/invoice/' + this.state.selectedInvoice, requestOptions)
            .then(response => {
                if (response.ok) {
                    const result = this.state.data.filter(row => row.invoice_no !== this.state.selectedInvoice);
                    this.setState({ data: result, selectedInvoice: "", error: null })
                } else {
                    let err = "Problem occurred deleting invoice"
                    throw new Error(err);
                }
            })
            .catch(error => {
                this.setState({ error: error.message, loading: false })
            });
        this.handleCloseDelete();
    }

    //opens delete modal
    handleShowDelete(event) {
        event.preventDefault();
        this.setState({
            showDeleteConf: true
        });
    }

    //closes delete modal
    handleCloseDelete = () => {
        this.setState({
            showDeleteConf: false
        });
    }

    render() {
        return (
            <Card className="m-4">
                <Card.Title className="m-4">Invoices</Card.Title>
                {this.state.error ? <h5 className="text-danger">{this.state.error}</h5> : <div />}
                {this.state.loading ? <h4>Loading data, please wait</h4> :
                    <Card.Body>
                        <Link to={
                            {
                                pathname: "/edit-invoice",
                                state: {
                                    data: this.state.data ? this.state.data.filter(row => row.invoice_no == this.state.selectedInvoice)[0] : ""
                                }
                            }
                        }>
                            <Button
                                disabled={this.state.selectedInvoice === ""}
                                className='m-2'>
                                Edit
                        </Button>
                        </Link>
                        <Button
                            disabled={this.state.selectedInvoice === ""}
                            variant='danger'
                            className='m-2'
                            onClick={this.handleShowDelete.bind(this)}>
                            Delete
                        </Button>
                        <Button
                            variant='secondary'
                            className='m-2'
                            disabled={this.state.selectedInvoice === ""}
                            href={"/invoices/" + this.state.selectedInvoice}>
                            View Invoice Details</Button>
                        <Button
                            variant="success"
                            className="m-2"
                            href="/new-invoice">
                            New Invoice
                            </Button>
                        <Form>
                            <Table bordered striped className='mt-2'>
                                <thead>
                                    <th>Selected</th>
                                    <th>Invoice_no</th>
                                    <th>Invoice_date</th>
                                    <th>Discount</th>
                                    <th>VAT</th>
                                    <th>Payment Method</th>
                                    <th>Paid</th>
                                    <th>Date Paid</th>
                                    <th>Delivery Ref</th>
                                </thead>
                                <tbody>
                                    {this.state.data ? this.state.data.map((invoice) => {
                                        return (
                                            <tr key={invoice.invoice_no}>
                                                <td>
                                                    <Form.Check
                                                        type="radio"
                                                        name="group1"
                                                        checked={this.state.selectedInvoice == invoice.invoice_no}
                                                        aria-label={invoice.invoice_no}
                                                        value={invoice.invoice_no}
                                                        onChange={e => this.handleOptionChange(e)}
                                                    />
                                                </td>
                                                <td>{invoice.invoice_no}</td>
                                                <td>{invoice.invoice_date ? util.formatDate(invoice.invoice_date) : ""}</td>
                                                <td>{invoice.discount}</td>
                                                <td>{invoice.vat}</td>
                                                <td>{invoice.payment_method}</td>
                                                <td>{invoice.paid}</td>
                                                <td>{invoice.date_paid ? util.formatDate(invoice.date_paid) : ""}</td>
                                                <td>{invoice.delivery_ref}</td>
                                            </tr>
                                        )
                                    }) : <tr></tr>}
                                </tbody>
                            </Table>
                        </Form>
                        <DeleteConfirmation
                            handleClose={this.handleCloseDelete.bind(this)}
                            handleShow={this.handleShowDelete.bind(this)}
                            handleDelete={this.handleDelete.bind(this)}
                            showDelete={this.state.showDeleteConf}
                            table="invoice"
                            selectedRef={this.state.selectedInvoice}
                        ></DeleteConfirmation>
                    </Card.Body>
                }
            </Card>
        )
    }
}

export default InvoiceViewer