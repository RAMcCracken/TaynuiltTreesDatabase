import React, { Component } from 'react'
import { Card, Row, Col, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form'
import { DashCircle, PlusCircle } from 'react-bootstrap-icons'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import { withRouter } from 'react-router'
import OrderProductEditor from './OrderProductEditor'
const util = require("../../Utils")

class OrderSummary extends Component {
    constructor(props) {
        super(props)

        this.state = {
            order_no: this.props.match.params.id,
            order_details: null,
            order_products: [{ id: 1, product_code: "", quantity: "", bags: "" }],
            invoices: [],
            selectedInvoice: "",
            disabled: true,
            loading: true,
            error: null,
        }
    }

    componentDidMount() {
        this.fetchOrderSummary();
    }

    fetchOrderSummary() {
        fetch('/api/order/' + this.state.order_no + "/detailed")
            .then(response => {
                if (response.ok) {

                    return response.json()
                } else {
                    let err = "Problem occurred fetching order data"
                    throw new Error(err);
                }
            })
            .then(data => {
                // let products
                // let product_ids = null
                // if (data.order_ass_prod) {
                //     products = data.order_ass_prod.split(",");
                //     product_ids = products.map((product, i) => {
                //         const id = i + 1
                //         return { id, product_code: product.product_code, quantity: product.quantity, bags: product.quantity }
                //     })
                // }

                this.setState({ order_details: data.order, order_products: data.order_ass_prod, invoices: data.invoices, loading: false, error: null })
            })
            .catch(error => {
                console.log("here");
                this.setState({ error: error.message, loading: false })
            });
    }

    handleOptionChange = e => {
        this.setState({
            selectedInvoice: e.target.value
        });
    };

    handleChangeProduct = (i, e) => {
        const values = [...this.state.order_products]
        values[i][e.target.name] = e.target.value
        this.setState({ order_products: values });
    }

    handleAdd = (id) => {
        this.setState({ order_products: [...this.state.order_products, { id: id + 2, product_code: "", quantity: "", bags: "" }] })
    }

    handleSubtract = (i) => {
        const values = [...this.state.order_products]
        values.splice(i, 1)
        this.setState({ order_products: [...values] })
    }

    handleSubmitOrderProd(e, id) {
        e.preventDefault();
        let product = this.state.order_products.filter(product => product.id === id)[0]

        console.log(e.target.name + " " + e.target.value);
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                order_no: this.state.order_no,
                product_code: product.product_code,
                quantity: product.quantity,
                bags: product.bags
            }
        };
        requestOptions.body = JSON.stringify(requestOptions.body);
        fetch('/api/order/' + this.state.order_no + "/product", requestOptions)
            .then(response => {
                response.json();
                if (response.ok) {
                }
            })
    }

    render() {
        const { order_details, order_products, invoices } = this.state
        return (
            <Card className='m-4' >

                <Card.Body>
                    <Card.Title className='mt-4 mb-4'>Order Summary: {this.state.order_no}</Card.Title>
                    {this.state.error ? <h5 className="text-danger">{this.state.error}</h5> : <div />}
                    {this.state.loading ? <h4>Loading data, please wait</h4> :
                        <div>
                            <Card.Subtitle >Order Details</Card.Subtitle>
                            <Container w-100 className="m-0" >
                                <Row>
                                    <Col>
                                        <Card.Text>Order No: {this.state.order_no}</Card.Text>
                                    </Col>
                                    <Col>
                                        <Card.Text>Order Date: {util.formatDate(order_details.order_date)}</Card.Text>
                                    </Col>
                                    <Col>
                                        <Card.Text>Credit Period: {order_details.credit_period}</Card.Text>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Card.Text>Picked: {order_details.picked}</Card.Text>
                                    </Col>
                                    <Col>
                                        <Card.Text>Location: {order_details.location}</Card.Text>
                                    </Col>
                                    <Col>
                                        <Card.Text>Stock Reserve: {order_details.stock_reserve}</Card.Text>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Card.Text>Customer PO: {order_details.customer_po}</Card.Text>
                                    </Col>
                                    <Col>
                                        <Card.Text>Quote Ref: {order_details.quote_ref}</Card.Text>
                                    </Col>
                                    <Col>
                                        <Card.Text>Customer Ref: {order_details.customer_ref}</Card.Text>
                                    </Col>
                                </Row>
                            </Container>

                            <Card.Subtitle className="mt-4">Order Products</Card.Subtitle>
                            {/* {order_products.map((product, i) => (
                                <OrderProductEditor
                                    product_code={product.product_code}
                                    quantity={product.quantity}
                                    bags={product.bags}
                                    handleChangeProduct={this.handleChangeProduct}
                                    handleSubmitOrderProd={this.handleSubmitOrderProd}
                                ></OrderProductEditor>
                            ))} */}
                            {/* <Col xs={1} className="d-flex flex-col align-self-top"> */}
                            {/* <Button className="mb-4" onClick={() => this.handleAdd(i)}><PlusCircle></PlusCircle></Button> */}
                            {/* </Col> */}
                            <Card.Subtitle className="mt-4">Invoices</Card.Subtitle>
                            <Table bordered striped className='mt-2'>
                                <thead>
                                    <td>Selected</td>
                                    <td>Invoice_no</td>
                                    <td>Invoice_date</td>
                                    <td>Discount</td>
                                    <td>VAT</td>
                                    <td>Payment Method</td>
                                    <td>Paid</td>
                                    <td>Date Paid</td>
                                    <td>Delivery Ref</td>
                                </thead>
                                <tbody>
                                    {invoices ? invoices.map((invoice) => {
                                        return (
                                            <tr key={invoice.invoice_no}>
                                                <td>
                                                    <Form.Check
                                                        type="radio"
                                                        name="group1"
                                                        checked={this.state.selectedInvoice === invoice.invoice_no}
                                                        aria-label={invoice.invoice_no}
                                                        value={invoice.invoice_no}
                                                        onChange={e => this.handleOptionChange(e)}
                                                    />
                                                </td>
                                                <td>{invoice.invoice_no}</td>
                                                <td>{invoice.invoice_date}</td>
                                                <td>{invoice.discount}</td>
                                                <td>{invoice.vat}</td>
                                                <td>{invoice.payment_method}</td>
                                                <td>{invoice.paid}</td>
                                                <td>{invoice.date_paid}</td>
                                                <td>{invoice.delivery_ref}</td>
                                            </tr>
                                        )
                                    }) : <tr></tr>}
                                </tbody>
                            </Table>

                        </div>
                    }
                </Card.Body>

            </Card>

        )
    }
}

export default withRouter(OrderSummary) 