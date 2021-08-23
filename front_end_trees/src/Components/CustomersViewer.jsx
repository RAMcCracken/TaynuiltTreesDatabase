import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import { Modal } from 'react-bootstrap'
// import { withRouter } from "react-router";
import { Link } from "react-router-dom"


class CustomersViewer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            loading: true,
            error: null,
            selectedCustomerRef: "",
            showDeleteConf: false,
        }
    }

    componentDidMount() {
        this.fetchCustomerData();
    }

    fetchCustomerData() {
        fetch('/api/customer')
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    this.setState({ error: "Problem occurred fetching customer data" })
                }
            })
            .then(data => {
                this.setState({ data: data, loading: false, error: null })
            });
    }

    handleOptionChange = e => {
        this.setState({
            selectedCustomerRef: e.target.value
        });
    };

    handleEdit = e => {
        console.log(this.state.selectedCustomerRef)
        const customer_row = this.state.data.filter(row => row.customer_ref === this.state.selectedCustomerRef)[0];
        console.log(customer_row);
        // this.props.history.push("/edit-customer")
        // this.props.history.push(
        //     "/edit-customer",
        //     { state: { data: customer_row } }
        // )
    }

    handleDelete = e => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                customer_ref: this.state.selectedCustomerRef,
            }
        };

        requestOptions.body = JSON.stringify(requestOptions.body);
        fetch('/api/customer', requestOptions)
            .then(response => {
                if (response.ok) {
                    const result = this.state.data.filter(row => row.customer_ref !== this.state.selectedCustomerRef);
                    this.setState({ data: result, selectedCustomerRef: "" })
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
            <Card className='m-4' xs={12}>
                <Card.Title className='mt-4'>Customers</Card.Title>
                {this.state.error ? <h4>{this.state.error}</h4> : <div />}
                {this.state.loading ? <h4>Loading data, please wait</h4> :
                    <Card.Body>
                        <Link to={
                            {
                                pathname: "/edit-customer",
                                state: {
                                    data: this.state.data.filter(row => row.customer_ref === this.state.selectedCustomerRef)[0]
                                }
                            }
                        }>
                            <Button
                                disabled={this.state.selectedCustomerRef === ""}
                                className='m-2'
                                onClick={this.handleEdit}>
                                Edit
                        </Button>
                        </Link>
                        <Button
                            disabled={this.state.selectedCustomerRef === ""}
                            variant='danger'
                            className='m-2'
                            onClick={this.handleShowDelete.bind(this)}>
                            Delete
                        </Button>
                        <Button variant='success' className='m-2' href="/new-customer">New</Button>
                        <Form>
                            <Table bordered striped className='mt-2'>
                                <thead>
                                    <tr>
                                        <th>Selected</th>
                                        <th>Customer Ref</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Company</th>
                                        <th>Address</th>
                                        <th>Phone Number(s)</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {this.state.data.map(customer => {
                                        return (
                                            <tr key={customer.customer_ref}>
                                                <td>
                                                    <Form.Check
                                                        type="radio"
                                                        name="group1"
                                                        checked={this.state.selectedCustomerRef === customer.customer_ref}
                                                        aria-label={customer.customer_ref}
                                                        value={customer.customer_ref}
                                                        onChange={this.handleOptionChange}
                                                    />
                                                </td>
                                                <td>{customer.customer_ref}</td>
                                                <td>{customer.firstname + " " + customer.surname}</td>
                                                <td>{customer.email}</td>
                                                <td>{customer.company}</td>
                                                <td>
                                                    {customer.address_number + " ," + customer.address_street + " ,"
                                                        + customer.address_town + " ," + customer.address_postcode}
                                                </td>
                                                <td>{customer.phone_numbers}</td>
                                            </tr>
                                        );
                                    })}

                                </tbody>
                            </Table>
                        </Form>
                        <Modal
                            show={this.state.showDeleteConf}
                            onHide={this.handleCloseDelete.bind(this)}
                            backdrop="static"
                        >
                            <Modal.Body>Are you sure you want to delete this customer?</Modal.Body>
                            <Modal.Footer>
                                <Button onClick={this.handleCloseDelete.bind(this)}>No, cancel</Button>
                                <Button variant="danger" onClick={this.handleDelete}>Yes, delete customer {this.state.selectedCustomerRef}</Button>
                            </Modal.Footer>
                        </Modal>
                    </Card.Body>
                }

            </Card>
        )
    }
}

export default CustomersViewer
