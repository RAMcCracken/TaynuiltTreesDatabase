import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import DeliveryForm from './DeliveryForm'
const util = require("../../Utils")

class DeliveryCreator extends Component {
    constructor(props) {
        super(props)

        this.state = {
            delivery_ref: "",
            address1: "",
            address2: "",
            address3: "",
            address4: "",
            dispatch_date: "",
            site_ref: "",
            delivery_charge: 0,
            box_bag_total: 0,
            notes: "",
        }
    }

    handleChange = e => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value,
        });
    };

    handleDateChange = e => {
        this.setState({
            dispatch_date: e
        })
    }

    handleOptionChange = e => {
        const target = e.target;
        const value = target.checked;
        const name = target.name;
        this.setState({
            [name]: value
        });
    };

    handleCancel() {
        this.props.history.push("/deliveries");
    }

    handleSubmit = e => {
        e.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                delivery_ref: this.state.delivery_ref,
                address_number: this.state.address1,
                address_street: this.state.address2,
                address_town: this.state.address3,
                address_postcode: this.state.address4,
                dispatch_date: util.formatDate(this.state.dispatch_date),
                site_ref: this.state.site_ref,
                delivery_charge: this.state.delivery_charge,
                box_bag_total: this.state.box_bag_total,
                notes: this.state.notes,
            }
        }
        requestOptions.body = JSON.stringify(requestOptions.body);
        fetch('/api/delivery', requestOptions)
            .then(response => {
                if (response.ok) {
                    e.target.reset();
                    this.setState({
                        error: null
                    })
                    this.props.history.push("/deliveries");
                } else {
                    return response.json().then((error) => {
                        let err = error.sql_err
                        throw new Error(err);
                    })
                }
            })
            .catch(error => {
                this.setState({ error: error.message, loading: false })
            });
    }

    render() {
        const { delivery_ref, address1, address2, address3, address4, dispatch_date, site_ref, delivery_charge, box_bag_total, notes } = this.state
        return (
            <Card className='m-4' >
                <Card.Title className='m-4'>Add New Delivery</Card.Title>
                {this.state.error ? <h5 className="text-danger">{this.state.error}</h5> : <div />}
                <Card.Body className="d-flex flex-row justify-content-center">
                    <Form className="w-50" onSubmit={this.handleSubmit}>
                        <DeliveryForm
                            delivery_ref={delivery_ref}
                            address1={address1}
                            address2={address2}
                            address3={address3}
                            address4={address4}
                            dispatch_date={dispatch_date}
                            site_ref={site_ref}
                            delivery_charge={delivery_charge}
                            box_bag_total={box_bag_total}
                            notes={notes}
                            handleChange={this.handleChange.bind(this)}
                            handleDateChange={this.handleDateChange.bind(this)}
                            handleSubmit={this.handleSubmit.bind(this)}
                            handleOptionChange={this.handleOptionChange.bind(this)}
                            handleCancel={this.handleCancel.bind(this)}
                        ></DeliveryForm>
                    </Form>
                </Card.Body>
            </Card >
        )
    }
}

export default DeliveryCreator