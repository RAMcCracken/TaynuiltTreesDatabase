import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap';
import { CheckCircle, Pencil, XCircle } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

class OrderProductEditor extends Component {
    constructor(props) {
        super(props)

        this.state = {
            old_product_code: this.props.product_code,
            old_quantity: this.props.quantity,
            old_bags: this.props.bags,
            edit: false,
        }
    }

    handleCancel() {
        if (!this.state.old_product_code && !this.state.old_quantity && !this.state.old_bags) {
            this.props.handleSubtract(this.props.i)
        } else {
            this.props.handleCancel(this.props.i, this.state.old_product_code, this.state.old_quantity, this.state.old_bags);
            this.setState({ edit: false })
        }
    }

    handleSave(e) {
        e.preventDefault();
        if (!this.state.old_product_code && !this.state.old_quantity && !this.state.old_bags) {
            this.props.handleSubmitOrderProd(this.props.id)
        } else {
            this.props.handleEditOrderProd(this.props.id, this.state.old_product_code)
        }
        this.setState({ edit: false })
    }

    render() {
        return (
            <Form>
                <Form.Label>Product {this.props.product_code}</Form.Label>
                <Form.Group className="mb-3" controlId="product.id">
                    <Row>
                        <Col xs={4}>
                            <Form.Control
                                type="text"
                                placeholder="Product Code"
                                disabled={!this.state.edit}
                                name="product_code"
                                value={this.props.product_code}
                                onChange={e => this.props.handleChangeProduct(this.props.i, e)}
                            />
                        </Col>
                        <Col xs={2}>
                            <Form.Control
                                type="number"
                                placeholder="Quantity"
                                disabled={!this.state.edit}
                                name="quantity"
                                value={this.props.quantity}
                                onChange={e => this.props.handleChangeProduct(this.props.i, e)}
                            />
                        </Col>
                        <Col xs={2}>
                            <Form.Control
                                type="text"
                                placeholder="Bags"
                                disabled={!this.state.edit}
                                name="bags"
                                value={this.props.bags}
                                onChange={e => this.props.handleChangeProduct(this.props.i, e)}
                            />
                        </Col>
                        {this.state.edit &&
                            <Col xs={1} className="d-flex flex-col align-self-top">
                                <Button
                                    className="mb-4"
                                    variant="danger"
                                    onClick={this.handleCancel.bind(this)}>
                                    <XCircle></XCircle></Button>
                            </Col>}
                        {this.state.edit && <Col xs={1} className="d-flex flex-col align-self-top">
                            <Button
                                className="mb-4"
                                variant="success"
                                type="submit"
                                onClick={e => this.handleSave(e)}>
                                <CheckCircle></CheckCircle></Button>
                        </Col>}
                        {!this.state.edit &&
                            <Col xs={2} className="d-flex flex-col align-self-top">
                                <Button
                                    className="mb-4"
                                    variant="primary"
                                    onClick={() => this.setState({ edit: true })}>
                                    <Pencil></Pencil> Edit </Button>
                            </Col>
                        }
                    </Row>
                </Form.Group>
            </Form>
        )
    }
}

export default OrderProductEditor