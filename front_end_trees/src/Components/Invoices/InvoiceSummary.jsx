import React, { Component } from 'react'
import { Card, Row, Col, Container } from 'react-bootstrap';
import { ArrowLeft, PlusCircle } from 'react-bootstrap-icons'
import Button from 'react-bootstrap/Button'
import OrderProductEditor from '../Orders/OrderProductEditor'
import DeleteConfirmation from '../DeleteConfirmation'
const util = require("../../Utils")

class InvoiceSummary extends Component {
    constructor(props) {
        super(props)

        this.state = {
            invoice_no: this.props.match.params.id,
            invoice_details: null,
            invoice_products: [{ id: 1, product_code: "", quantity: "", bags: "" }],
            disabled: true,
            toDelete: "",
            loading: true,
            error: null,
            showDeleteConf: false
        }
    }

    componentDidMount() {
        this.fetchInvoiceSummary();
    }

    fetchInvoiceSummary() {
        fetch('/api/invoice/' + this.state.invoice_no + "/detailed")
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
                if (data.invoice_ass_prod) {
                    products = data.invoice_ass_prod;
                    product_ids = products.map((product, i) => {
                        const id = i + 1
                        return { id, product_code: product.product_code, quantity: product.quantity, bags: product.bags }
                    })
                }
                console.log(data);
                this.setState({ invoice_details: data.invoice, invoice_products: product_ids, loading: false, error: null })
            })
            .catch(error => {
                console.log("here");
                this.setState({ error: error.message, loading: false })
            });
    }

    handleChangeProduct = (i, e) => {
        const values = [...this.state.invoice_products]
        values[i][e.target.name] = e.target.value
        this.setState({ invoice_products: values });
    }

    handleSubtract = (i) => {
        if (i === 0) {
            this.setState({ quote_products: [] })
        } else {
            const values = [...this.state.invoice_products]
            values.splice(i, 1)
            this.setState({ invoice_products: [...values] })
        }

    }

    handleAdd = (id) => {
        this.setState({ invoice_products: [...this.state.invoice_products, { id: id + 2, product_code: "", quantity: "", bags: "" }] })
    }


    handleDelete() {
        let product = this.state.invoice_products.filter(product => product.id === this.state.toDelete)[0]

        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch('/api/invoice/' + this.state.invoice_no + "/product/" + product.product_code, requestOptions)
            .then(response => {
                if (response.ok) {
                    const result = this.state.invoice_products.filter(product => product.id !== this.state.toDelete);
                    this.setState({ invoice_products: result, toDelete: "" })
                }
            })
        this.handleCloseDelete();
    }

    handleCancel(i, old_product, old_quant, old_bags) {
        const values = [...this.state.invoice_products]
        values[i]["product_code"] = old_product
        values[i]["quantity"] = old_quant
        values[i]["bags"] = old_bags
        this.setState({ invoice_products: values });
    }

    handleSubmitOrderProd(id) {
        if (!this.validateProductCodes()) {
            this.setState({ error: "Please enter a unique product code" })
            return;
        } else {
            this.setState({ error: null })
        }

        let product = this.state.invoice_products.filter(product => product.id === id)[0]

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                invoice_no: this.state.invoice_no,
                product_code: product.product_code,
                quantity: product.quantity,
                bags: product.bags
            }
        };
        requestOptions.body = JSON.stringify(requestOptions.body);
        fetch('/api/invoice/' + this.state.invoice_no + "/product", requestOptions)
            .then(response => {
                response.json();
                if (response.ok) {
                    window.location.reload(false);
                }
            })
    }

    validateProductCodes(product_code) {
        const arr = this.state.invoice_products.filter(product => product.product_code === product_code)
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

        let product = this.state.invoice_products.filter(product => product.id === id)[0]

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                invoice_no: this.state.invoice_no,
                product_code: product.product_code,
                quantity: product.quantity,
                bags: product.bags
            }
        };
        requestOptions.body = JSON.stringify(requestOptions.body);
        fetch('/api/invoice/' + this.state.invoice_no + "/product/" + old_product, requestOptions)
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
        const { invoice_no, invoice_details, invoice_products } = this.state;
        return (
            <Card className='m-4' >
                <Card.Body>
                    <Row>
                        <Col>
                            <Card.Title xs={9}>Invoice Summary: {this.state.invoice_no}</Card.Title>
                        </Col>
                        <Col xs={3}>
                            <Button
                                variant='outline-primary'
                                className='mb-4'
                                href="/invoices">
                                <ArrowLeft className="mr-1"></ArrowLeft>
                                Back to Invoices</Button>
                        </Col>
                    </Row>

                    {this.state.error ? <h5 className="text-danger">{this.state.error}</h5> : <div />}
                    {this.state.loading && <h4>Loading data, please wait</h4>}
                    {!this.state.error && !this.state.loading &&
                        <div>
                            <Card.Subtitle >Invoice Details</Card.Subtitle>
                            <Container w-100 className="m-0" >
                                <Row>
                                    <Col>
                                        <Card.Text>Invoice Number: {this.state.invoice_no}</Card.Text>
                                    </Col>
                                    <Col>
                                        <Card.Text>Order No: {invoice_details.order_no}</Card.Text>
                                    </Col>
                                    <Col>
                                        <Card.Text>Invoice Date: {util.formatDate(invoice_details.invoice_date)}</Card.Text>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Card.Text>Discount(%): {invoice_details.discount}</Card.Text>
                                    </Col>

                                    <Col>
                                        <Card.Text>VAT(%): {invoice_details.vat}</Card.Text>
                                    </Col>
                                    <Col>
                                        <Card.Text>Paid: {invoice_details.paid}</Card.Text>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Card.Text>Payment Method: {invoice_details.payment_method}</Card.Text>
                                    </Col>
                                    <Col>
                                        <Card.Text>Date Paid: {util.formatDate(invoice_details.date_paid)}</Card.Text>
                                    </Col>
                                    <Col>
                                        <Card.Text>Delivery Ref: {invoice_details.delivery_ref}</Card.Text>
                                    </Col>
                                </Row>

                            </Container>

                            <Card.Subtitle className="mt-4">Invoice Products</Card.Subtitle>
                            {invoice_products.map((product, i) => (
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
                            <Button className="mb-4" onClick={() => this.handleAdd(invoice_products.length)}><PlusCircle></PlusCircle></Button>
                        </div>
                    }
                    <DeleteConfirmation
                        handleClose={this.handleCloseDelete.bind(this)}
                        handleShow={this.handleShowDelete.bind(this)}
                        handleDelete={this.handleDelete.bind(this)}
                        showDelete={this.state.showDeleteConf}
                        table="product"
                        selectedRef={this.state.toDelete}
                    ></DeleteConfirmation>
                </Card.Body>
            </Card>
        )
    }
}

export default InvoiceSummary