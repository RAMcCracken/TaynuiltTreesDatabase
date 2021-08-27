import React, { Component } from 'react'
import { Card, Row, Col, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form'
import { ArrowLeft, DashCircle, PlusCircle } from 'react-bootstrap-icons'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import { withRouter } from 'react-router'
import OrderProductEditor from './OrderProductEditor'
import DeleteConfirmation from '../DeleteConfirmation'
import { Link } from "react-router-dom"
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
            toDelete: "",
            disabled: true,
            loading: true,
            error: null,
            showDeleteConf: false
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
                let products
                let product_ids = null
                if (data.order_ass_prod) {
                    products = data.order_ass_prod;
                    product_ids = products.map((product, i) => {
                        const id = i + 1
                        return { id, product_code: product.product_code, quantity: product.quantity, bags: product.bags }
                    })
                }

                this.setState({ order_details: data.order, order_products: product_ids, invoices: data.invoices, loading: false, error: null })
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
        console.log(i);
        if (i === 0) {
            this.setState({ quote_products: [] })
        } else {
            const values = [...this.state.order_products]
            values.splice(i, 1)
            this.setState({ order_products: [...values] })
        }

    }

    handleDelete() {
        let product = this.state.order_products.filter(product => product.id === this.state.toDelete)[0]

        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch('/api/order/' + this.state.order_no + "/product/" + product.product_code, requestOptions)
            .then(response => {
                if (response.ok) {
                    const result = this.state.order_products.filter(product => product.id !== this.state.toDelete);
                    this.setState({ order_products: result, toDelete: "" })
                }
            })
        this.handleCloseDelete();
    }

    handleCancel(i, old_product, old_quant, old_bags) {
        const values = [...this.state.order_products]
        values[i]["product_code"] = old_product
        values[i]["quantity"] = old_quant
        values[i]["bags"] = old_bags
        this.setState({ order_products: values });
    }

    handleSubmitOrderProd(id) {
        if (!this.validateProductCodes()) {
            this.setState({ error: "Please enter a unique product code" })
            return;
        } else {
            this.setState({ error: null })
        }

        let product = this.state.order_products.filter(product => product.id === id)[0]

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
                    window.location.reload(false);
                }
            })
    }

    validateProductCodes(product_code) {
        const arr = this.state.order_products.filter(product => product.product_code === product_code)
        if (arr.length > 1) {
            return false
        }
        return true
    }


    handleEditOrderProd(id, old_product) {
        if (!this.validateProductCodes()) {
            this.setState({ error: "Please enter a unique product code" })
            return;
        } else {
            this.setState({ error: null })
        }

        let product = this.state.order_products.filter(product => product.id === id)[0]

        const requestOptions = {
            method: 'PUT',
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
        fetch('/api/order/' + this.state.order_no + "/product/" + old_product, requestOptions)
            .then(response => {
                response.json();
                if (response.ok) {
                    window.location.reload(false);
                }
            })
    }

    //opens delete modal
    handleShowDelete = (event, id) => {
        event.preventDefault();
        this.setState({
            toDelete: id,
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
        const { order_details, order_products, invoices } = this.state
        return (
            <Card className='m-4' >

                <Card.Body>
                    <Row>
                        <Col>
                            <Card.Title xs={9}>Order Summary: {this.state.order_no}</Card.Title>
                        </Col>
                        <Col xs={3}>
                            <Button
                                variant='outline-primary'
                                className='mb-4'
                                href="/orders">
                                <ArrowLeft className="mr-1"></ArrowLeft>
                                Back to Orders</Button>
                        </Col>
                    </Row>

                    {this.state.error ? <h5 className="text-danger">{this.state.error}</h5> : <div />}
                    {this.state.loading && <h4>Loading data, please wait</h4>}
                    {!this.state.error && !this.state.loading &&
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
                            {order_products.map((product, i) => (
                                <OrderProductEditor
                                    id={product.id}
                                    product_code={product.product_code}
                                    quantity={product.quantity}
                                    bags={product.bags}
                                    i={i}
                                    handleChangeProduct={this.handleChangeProduct}
                                    handleSubmitOrderProd={this.handleSubmitOrderProd.bind(this)}
                                    handleEditOrderProd={this.handleEditOrderProd.bind(this)}
                                    handleSubtract={this.handleSubtract}
                                    handleCancel={this.handleCancel.bind(this)}
                                    handleDelete={this.handleShowDelete}
                                ></OrderProductEditor>
                            ))}
                            <Button className="mb-4" onClick={() => this.handleAdd(order_products.length)}><PlusCircle></PlusCircle></Button>
                            <Card.Subtitle className="mt-4">Invoices</Card.Subtitle>
                            <Link
                                onClick={e => this.state.selectedInvoice === "" && e.preventDefault()}
                                to={
                                    {
                                        pathname: "/edit-invoice",
                                        state: {
                                            data: invoices ? invoices.filter(row => row.invoice_no == this.state.selectedInvoice)[0] : ""
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

                        </div>

                    }
                </Card.Body>
                <DeleteConfirmation
                    handleClose={this.handleCloseDelete.bind(this)}
                    handleShow={this.handleShowDelete.bind(this)}
                    handleDelete={this.handleDelete.bind(this)}
                    showDelete={this.state.showDeleteConf}
                    table="order product"
                    selectedRef={""}
                ></DeleteConfirmation>

            </Card>

        )
    }
}

export default withRouter(OrderSummary) 