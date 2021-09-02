import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import { Link } from "react-router-dom"
import { withRouter } from "react-router";
import DeleteConfirmation from '../DeleteConfirmation'
const util = require("../../Utils")

class DeliveryViewer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            loading: true,
            error: null,
            selectedDeliveryRef: "",
            showDeleteConf: false
        }
    }

    componentDidMount() {
        this.fetchDeliveryData();
    }

    fetchDeliveryData() {
        fetch('/api/delivery')
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    let err = "Problem occurred fetching delivery data"
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
            selectedDeliveryRef: e.target.value
        });
    };

    handleEdit = e => {
        console.log(this.state.selectedDeliveryRef)
        const delivery_row = this.state.data.filter(row => row.delivery_ref === this.state.selectedDeliveryRef)[0];
        console.log(delivery_row);
    }

    handleDelete = e => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch('/api/delivery/' + this.state.selectedDeliveryRef, requestOptions)
            .then(response => {
                if (response.ok) {
                    const result = this.state.data.filter(row => row.delivery_ref !== this.state.selectedDeliveryRef);
                    this.setState({ data: result, selectedDeliveryRef: "" })
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
                <Card.Title className='m-4'>Deliveries</Card.Title>
                {this.state.error ? <h5 className="text-danger">{this.state.error}</h5> : <div />}
                {this.state.loading ? <h4>Loading data, please wait</h4> :
                    <Card.Body>
                        <Link to={
                            {
                                pathname: "/edit-delivery",
                                state: {
                                    data: this.state.data ? this.state.data.filter(row => row.delivery_ref === this.state.selectedDeliveryRef)[0] : ""
                                }
                            }
                        }>
                            <Button
                                disabled={this.state.selectedDeliveryRef === ""}
                                className='m-2'
                                onClick={this.handleEdit}>
                                Edit
                        </Button>
                        </Link>
                        <Button
                            disabled={this.state.selectedDeliveryRef === ""}
                            variant='danger'
                            className='m-2'
                            onClick={this.handleShowDelete.bind(this)}>
                            Delete
                        </Button>
                        <Button
                            variant='secondary'
                            className='m-2'
                            disabled={this.state.selectedDeliveryRef === ""}
                            href={"/deliveries/" + this.state.selectedDeliveryRef}>
                            View Delivery Details</Button>
                        <Form>
                            <Table bordered striped className='mt-2'>
                                <thead>
                                    <tr>
                                        <th>Selected</th>
                                        <th>Delivery Ref</th>
                                        <th>Delivery Address</th>
                                        <th>Dispatch Date</th>
                                        <th>Site Ref</th>
                                        <th>Delivery Charge</th>
                                        <th>Box/Bags Total</th>
                                        <th>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.data ? this.state.data.map(delivery => {
                                        return (
                                            <tr key={delivery.delivery_ref}>
                                                <td>
                                                    <Form.Check
                                                        type="radio"
                                                        name="group1"
                                                        checked={this.state.selectedDeliveryRef === delivery.delivery_ref}
                                                        aria-label={delivery.delivery_ref}
                                                        value={delivery.delivery_ref}
                                                        onChange={this.handleOptionChange}
                                                    />
                                                </td>
                                                <td>{delivery.delivery_ref}</td>
                                                <td>
                                                    {delivery.address_number + " ," + delivery.address_street + " ,"
                                                        + delivery.address_town + " ," + delivery.address_postcode}
                                                </td>
                                                <td>{delivery.dispatch_date ? util.formatDate(delivery.dispatch_date) : ""}</td>
                                                <td>{delivery.site_ref}</td>
                                                <td>{delivery.delivery_charge}</td>
                                                <td>{delivery.box_bag_total}</td>
                                                <td>{delivery.notes}</td>
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
                            table="delivery"
                            selectedRef={this.state.selectedDeliveryRef}
                        ></DeleteConfirmation>
                    </Card.Body>
                }
            </Card>
        )
    }
}

export default withRouter(DeliveryViewer)