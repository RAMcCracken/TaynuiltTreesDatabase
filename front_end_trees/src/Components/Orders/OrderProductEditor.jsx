import React, { Component } from 'react'
import { Row, Col, AccordionButton } from 'react-bootstrap';
import { CheckCircle, Pencil, XCircle, Trash } from 'react-bootstrap-icons';
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

    handleDelete(e) {
        e.preventDefault();
        if (!this.state.old_product_code && !this.state.old_quantity && !this.state.old_bags) {
            this.props.handleSubtract(this.props.i)
        } else {
            this.props.handleDelete(e, this.props.id);
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
                <Form.Group className="mb-3" controlId="product.id">
                    <Row>
                        <Col xs={4}>
                            <Form.Label>Product Code</Form.Label>
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
                            <Form.Label>Quantity</Form.Label>
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
                            <Form.Label>Bags</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Bags"
                                disabled={!this.state.edit}
                                name="bags"
                                value={this.props.bags}
                                onChange={e => this.props.handleChangeProduct(this.props.i, e)}
                            />
                        </Col>
                        {this.state.edit &&
                            <Col xs={1} className="mt-4 d-flex flex-col align-self-end">
                                <Button
                                    variant="danger"
                                    disabled={this.props.i === 0}
                                    onClick={this.handleCancel.bind(this)}>
                                    <XCircle></XCircle></Button>
                            </Col>}
                        {this.state.edit && <Col xs={1} className="mt-4 d-flex flex-col align-self-end">
                            <Button
                                variant="success"
                                type="submit"
                                onClick={e => this.handleSave(e)}>
                                <CheckCircle></CheckCircle></Button>
                        </Col>}
                        {!this.state.edit &&
                            <Col xs={2} className="mt-4 d-flex flex-col align-self-end">
                                <Button
                                    variant="primary"
                                    onClick={() => this.setState({ edit: true })}>
                                    <Pencil></Pencil> Edit </Button>
                            </Col>
                        }
                        <Col xs={2} className="mt-4 d-flex flex-col align-self-end">
                            <Button
                                variant="outline-danger"
                                onClick={e => this.handleDelete(e)}>
                                <Trash></Trash> Delete </Button>
                        </Col>
                    </Row>
                </Form.Group>
            </Form>
        )
    }
}

export default OrderProductEditor