import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import { Link } from 'react-router-dom'
import DeleteConfirmation from '../DeleteConfirmation'
import { Alert } from 'react-bootstrap'
const util = require('../../Utils')

class QuoteViewer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            loading: true,
            error: null,
            selectedQuote: "",
            showDeleteConf: false
        }
    }

    componentDidMount() {
        this.fetchQuotes();
    }

    fetchQuotes() {
        fetch('/api/quote')
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    let err = "Problem occurred fetching quote data"
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
            selectedQuote: e.target.value
        });
    };


    handleDelete = e => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch('/api/quote/' + this.state.selectedQuote, requestOptions)
            .then(response => {
                if (response.ok) {
                    const result = this.state.data.filter(row => row.quote_ref != this.state.selectedQuote);

                    this.setState({ data: result, selectedQuote: "", error: null })
                } else {
                    let err = "Problem occurred deleting this quote"
                    throw new Error(err);
                }
            })
            .catch(error => {
                this.setState({ error: error.message })

            })
        this.handleCloseDelete();
    }

    handleConfirm() {
        let quote = this.state.data.filter(row => row.quote_ref == this.state.selectedQuote)[0]

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                quote_number: quote.quote_number,
                order_date: util.formatDate(quote.order_date),
                credit_period: quote.credit_period,
                picked: quote.picked,
                location: quote.location,
                stock_reserve: quote.stock_reserve,
                customer_po: quote.customer_po,
                customer_ref: quote.customer_ref,
            }
        };
        requestOptions.body = JSON.stringify(requestOptions.body);
        fetch('/api/quote/' + this.state.selectedQuote + '/confirm', requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    let err = "Problem occurred confirming quote"
                    throw new Error(err);
                }
            })
            .then(data => {
                let res = this.state.data.map(row => {
                    if (row.quote_ref === this.state.selectedQuote) {
                        row.quote_confirmed = 1;
                    }
                    return row
                })


                console.log(res);

                this.setState({ data: res })
                alert("Quote, " + this.state.selectedQuote + " successfully confirmed as order " + data.order_no)

            })
            .catch(error => {
                this.setState({ error: error.message })
            })
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
            <Card className='m-4'>
                <Card.Title className='m-4'>Quotes</Card.Title>
                {this.state.error ? <h5 className="text-danger m-4">{this.state.error}</h5> : <div />}
                {this.state.loading ? <h4>Loading data, please wait</h4> :
                    <Card.Body>
                        <Link to={
                            {
                                pathname: "/edit-quote",
                                state: {
                                    data: this.state.data ? this.state.data.filter(row => row.quote_ref == this.state.selectedQuote)[0] : ""
                                }
                            }
                        }>
                            <Button
                                disabled={this.state.selectedQuote === ""}
                                className='m-2'
                                onClick={this.handleEdit}>
                                Edit
                        </Button>
                        </Link>
                        <Button
                            disabled={this.state.selectedQuote === ""}
                            variant='danger'
                            className='m-2'
                            onClick={this.handleShowDelete.bind(this)}>
                            Delete
                        </Button>
                        <Button
                            variant='secondary'
                            className='m-2'
                            disabled={this.state.selectedQuote === ""}
                            href={"/quotes/" + this.state.selectedQuote}>
                            View Quote Details</Button>
                        <Button
                            variant='secondary'
                            className='m-2'
                            disabled={this.state.selectedQuote === ""}
                            onClick={e => this.handleConfirm(e)}>
                            Confirm as Order</Button>
                        <Button
                            variant="success"
                            className="m-2"
                            href="/new-quote">
                            New Quote
                            </Button>
                        <Form>
                            <Table bordered striped className='mt-2'>
                                <thead>
                                    <tr>
                                        <th>Selected</th>
                                        <th>Quote Ref</th>
                                        <th>Quote Number</th>
                                        <th>Order Date</th>
                                        <th>Credit Period</th>
                                        <th>Picked</th>
                                        <th>Location</th>
                                        <th>Stock Reserve</th>
                                        <th>Customer PO</th>
                                        <th>Quote Ref</th>
                                        <th>Customer Ref</th>
                                        <th>Quote Confirmed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.data ? this.state.data.map(quote => {
                                        return (
                                            <tr key={quote.quote_ref}>
                                                <td>
                                                    <Form.Check
                                                        type="radio"
                                                        name="group1"
                                                        checked={this.state.selectedQuote == quote.quote_ref}
                                                        aria-label={quote.quote_ref}
                                                        value={quote.quote_ref}
                                                        onChange={e => this.handleOptionChange(e)}
                                                    />
                                                </td>
                                                <td>{quote.quote_ref}</td>
                                                <td>{quote.quote_number}</td>
                                                <td>{quote.order_date ? util.formatDate(quote.order_date) : ""}</td>
                                                <td>{quote.credit_period}</td>
                                                <td>{quote.picked}</td>
                                                <td>{quote.location}</td>
                                                <td>{quote.stock_reserve}</td>
                                                <td>{quote.customer_po}</td>
                                                <td>{quote.quote_ref}</td>
                                                <td>{quote.customer_ref}</td>
                                                <td>{quote.quote_confirmed}</td>
                                            </tr>
                                        );
                                    }) : <tr></tr>}
                                </tbody>

                            </Table>
                        </Form>
                        <DeleteConfirmation
                            handleClose={this.handleCloseDelete.bind(this)}
                            handleShow={this.handleShowDelete.bind(this)}
                            handleDelete={this.handleDelete.bind(this)}
                            showDelete={this.state.showDeleteConf}
                            table="quote"
                            selectedRef={this.state.selectedQuote}
                        ></DeleteConfirmation>
                    </Card.Body>
                }
            </Card>
        )
    }
}

export default QuoteViewer