import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import { Link } from "react-router-dom"
import { withRouter } from "react-router";
import DeleteConfirmation from '../DeleteConfirmation'
const util = require("../../Utils")

class OrdersViewer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            loading: true,
            error: null,
            selectedOrderNo: "",
            showDeleteConf: false
        }
    }

    componentDidMount() {
        this.fetchOrderData();
    }

    fetchOrderData() {
        fetch('/api/order')
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    let err = "Problem occurred fetching order data"
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
            selectedOrderNo: e.target.value
        });
    };

    handleEdit = e => {
        console.log(this.state.selectedOrderNo)
        const order_row = this.state.data.filter(row => row.order_no === this.state.selectedOrderNo)[0];
        console.log(order_row);
    }

    handleDelete = e => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch('/api/order/' + this.state.selectedOrderNo, requestOptions)
            .then(response => {
                if (response.ok) {
                    const result = this.state.data.filter(row => row.order_no !== this.state.selectedOrderNo);
                    this.setState({ data: result, selectedOrderNo: "" })
                }
            })
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
            <Card className='m-4'>
                <Card.Title className='m-4'>Orders</Card.Title>
                {this.state.error ? <h5 className="text-danger">{this.state.error}</h5> : <div />}
                {this.state.loading ? <h4>Loading data, please wait</h4> :
                    <Card.Body>
                        <Link to={
                            {
                                pathname: "/edit-order",
                                state: {
                                    data: this.state.data ? this.state.data.filter(row => row.order_no === this.state.selectedOrderNo)[0] : ""
                                }
                            }
                        }>
                            <Button
                                disabled={this.state.selectedOrderNo === ""}
                                className='m-2'
                                onClick={this.handleEdit}>
                                Edit
                        </Button>
                        </Link>
                        <Button
                            disabled={this.state.selectedOrderNo === ""}
                            variant='danger'
                            className='m-2'
                            onClick={this.handleShowDelete.bind(this)}>
                            Delete
                        </Button>
                        <Button
                            variant='secondary'
                            className='m-2'
                            disabled={this.state.selectedOrderNo === ""}
                            href={"/orders/" + this.state.selectedOrderNo}>
                            View Order Details</Button>
                        <Form>
                            <Table bordered striped className='mt-2'>
                                <thead>
                                    <tr>
                                        <th>Selected</th>
                                        <th>Order No</th>
                                        <th>Order Date</th>
                                        <th>Credit Period</th>
                                        <th>Picked</th>
                                        <th>Location</th>
                                        <th>Stock Reserve</th>
                                        <th>Customer PO</th>
                                        <th>Quote Ref</th>
                                        <th>Customer Ref</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.data ? this.state.data.map(order => {
                                        return (
                                            <tr key={order.order_no}>
                                                <td>
                                                    <Form.Check
                                                        type="radio"
                                                        name="group1"
                                                        checked={this.state.selectedOrderNo === order.order_no}
                                                        aria-label={order.order_no}
                                                        value={order.order_no}
                                                        onChange={this.handleOptionChange}
                                                    />
                                                </td>
                                                <td>{order.order_no}</td>
                                                <td>{util.formatDate(order.order_date)}</td>
                                                <td>{order.credit_period}</td>
                                                <td>{order.picked}</td>
                                                <td>{order.location}</td>
                                                <td>{order.stock_reserve}</td>
                                                <td>{order.customer_po}</td>
                                                <td>{order.quote_ref}</td>
                                                <td>{order.customer_ref}</td>
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
                            table="order"
                            selectedRef={this.state.selectedOrderNo}
                        ></DeleteConfirmation>
                    </Card.Body>
                }
            </Card>
        )
    }
}

export default withRouter(OrdersViewer)