import React, { Component } from 'react'
import { Card, Row, Col, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form'
import { ArrowLeft, DashCircle, PlusCircle } from 'react-bootstrap-icons'
import Button from 'react-bootstrap/Button'
import { withRouter } from 'react-router'
import OrderProductEditor from '../Orders/OrderProductEditor'
import DeleteConfirmation from '../DeleteConfirmation'
const util = require("../../Utils")

class QuoteSummary extends Component {
    constructor(props) {
        super(props)

        this.state = {
            quote_ref: this.props.match.params.id,
            quote_details: null,
            quote_products: [{ id: 1, product_code: "", quantity: "", bags: "" }],
            invoices: [],
            selectedInvoice: "",
            disabled: true,
            toDelete: "",
            loading: true,
            error: null,
            showDeleteConf: false
        }
    }

    componentDidMount() {
        this.fetchQuoteSummary();
    }

    fetchQuoteSummary() {
        fetch('/api/quote/' + this.state.quote_ref + "/detailed")
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
                if (data.quote_ass_prod) {
                    products = data.quote_ass_prod;
                    product_ids = products.map((product, i) => {
                        const id = i + 1
                        return { id, product_code: product.product_code, quantity: product.quantity, bags: product.bags }
                    })
                }
                console.log(data);
                this.setState({ quote_details: data.quote, quote_products: product_ids, loading: false, error: null })
            })
            .catch(error => {
                console.log("here");
                this.setState({ error: error.message, loading: false })
            });
    }

    handleChangeProduct = (i, e) => {
        const values = [...this.state.quote_products]
        values[i][e.target.name] = e.target.value
        this.setState({ quote_products: values });
    }

    handleSubtract = (i) => {
        const values = [...this.state.quote_products]
        values.splice(i, 1)
        this.setState({ quote_products: [...values] })
    }

    handleAdd = (id) => {
        this.setState({ quote_products: [...this.state.quote_products, { id: id + 2, product_code: "", quantity: "", bags: "" }] })
    }


    handleDelete() {
        let product = this.state.quote_products.filter(product => product.id === this.state.toDelete)[0]

        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch('/api/quote/' + this.state.quote_ref + "/product/" + product.product_code, requestOptions)
            .then(response => {
                if (response.ok) {
                    const result = this.state.quote_products.filter(product => product.id !== this.state.toDelete);
                    this.setState({ quote_products: result, toDelete: "" })
                }
            })
        this.handleCloseDelete();
    }

    handleCancel(i, old_product, old_quant, old_bags) {
        const values = [...this.state.quote_products]
        values[i]["product_code"] = old_product
        values[i]["quantity"] = old_quant
        values[i]["bags"] = old_bags
        this.setState({ quote_products: values });
    }

    handleSubmitOrderProd(id) {
        if (!this.validateProductCodes()) {
            this.setState({ error: "Please enter a unique product code" })
            return;
        } else {
            this.setState({ error: null })
        }

        let product = this.state.quote_products.filter(product => product.id === id)[0]

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                quote_ref: this.state.quote_ref,
                product_code: product.product_code,
                quantity: product.quantity,
                bags: product.bags
            }
        };
        requestOptions.body = JSON.stringify(requestOptions.body);
        fetch('/api/quote/' + this.state.quote_ref + "/product", requestOptions)
            .then(response => {
                response.json();
                if (response.ok) {
                    window.location.reload(false);
                }
            })
    }

    validateProductCodes(product_code) {
        const arr = this.state.quote_products.filter(product => product.product_code === product_code)
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

        let product = this.state.quote_products.filter(product => product.id === id)[0]

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                quote_ref: this.state.quote_ref,
                product_code: product.product_code,
                quantity: product.quantity,
                bags: product.bags
            }
        };
        requestOptions.body = JSON.stringify(requestOptions.body);
        fetch('/api/quote/' + this.state.quote_ref + "/product/" + old_product, requestOptions)
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
        const { quote_ref, quote_details, quote_products } = this.state;
        return (
            <Card className='m-4' >

                <Card.Body>
                    <Row>
                        <Col>
                            <Card.Title xs={9}>Quote Summary: {this.state.quote_ref}</Card.Title>
                        </Col>
                        <Col xs={3}>
                            <Button
                                variant='outline-primary'
                                className='mb-4'
                                href="/quotes">
                                <ArrowLeft className="mr-1"></ArrowLeft>
                                Back to Quotes</Button>
                        </Col>
                    </Row>

                    {this.state.error ? <h5 className="text-danger">{this.state.error}</h5> : <div />}
                    {this.state.loading && <h4>Loading data, please wait</h4>}
                    {!this.state.error && !this.state.loading &&
                        <div>
                            <Card.Subtitle >Quote Details</Card.Subtitle>
                            <Container w-100 className="m-0" >
                                <Row>
                                    <Col>
                                        <Card.Text>Quote Ref: {this.state.quote_ref}</Card.Text>
                                    </Col>
                                    <Col>
                                        <Card.Text>Quote Number: {this.state.quote_number}</Card.Text>
                                    </Col>
                                    <Col>
                                        <Card.Text>Order Date: {util.formatDate(quote_details.order_date)}</Card.Text>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Card.Text>Credit Period: {quote_details.credit_period}</Card.Text>
                                    </Col>

                                    <Col>
                                        <Card.Text>Picked: {quote_details.picked}</Card.Text>
                                    </Col>
                                    <Col>
                                        <Card.Text>Location: {quote_details.location}</Card.Text>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Card.Text>Stock Reserve: {quote_details.stock_reserve}</Card.Text>
                                    </Col>
                                    <Col>
                                        <Card.Text>Customer PO: {quote_details.customer_po}</Card.Text>
                                    </Col>
                                    <Col>
                                        <Card.Text>Customer Ref: {quote_details.customer_ref}</Card.Text>
                                    </Col>
                                </Row>
                            </Container>

                            <Card.Subtitle className="mt-4">Order Products</Card.Subtitle>
                            {quote_products.map((product, i) => (
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
                            <Button className="mb-4" onClick={() => this.handleAdd(quote_products.length)}><PlusCircle></PlusCircle></Button>
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

export default QuoteSummary