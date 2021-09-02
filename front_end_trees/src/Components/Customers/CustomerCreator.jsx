import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'

import CustomerForm from './CustomerForm'


class CustomerCreator extends Component {
    constructor(props) {
        super(props)
        this.state = {
            phoneFields: [{ id: 1, number: "" }],
            custref: "",
            firstname: "",
            surname: "",
            email: "",
            company: "",
            address1: "",
            address2: "",
            address3: "",
            address4: ""
        }
    }

    handleChangePhone = (i, e) => {
        const values = [...this.state.phoneFields]
        values[i][e.target.name] = e.target.value
        this.setState({ phoneFields: values });
    }

    handleChange = e => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value,
        });
    };

    handleAdd = (id) => {
        this.setState({ phoneFields: [...this.state.phoneFields, { id: id + 2, number: "" }] })
    }

    handleSubtract = (i) => {
        const values = [...this.state.phoneFields]
        values.splice(i, 1)
        this.setState({ phoneFields: [...values] })
    }

    handleCancel() {
        this.props.history.push("/customers");
    }

    handleSubmit = (e) => {
        e.preventDefault();

        let phoneNums = []

        this.state.phoneFields.forEach(element => {
            console.log(element.number)
            const number = [this.state.custref, element.number]
            phoneNums = [...phoneNums, number]
        });

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                customer_ref: this.state.custref,
                firstname: this.state.firstname,
                surname: this.state.surname,
                email: this.state.email,
                company: this.state.company,
                address_number: this.state.address1,
                address_street: this.state.address2,
                address_town: this.state.address3,
                address_postcode: this.state.address4,
                phone_numbers: phoneNums
            }
        };
        requestOptions.body = JSON.stringify(requestOptions.body);
        fetch('/api/customer', requestOptions)
            .then(response => {
                response.json();
                if (response.ok) {
                    e.target.reset();
                    this.props.history.push("/customers");
                }
            })


    }
    render() {
        const { custref, firstname, surname, email, company, address1, address2, address3, address4, phoneFields } = this.state
        return (
            <Card className='m-4' >
                <Card.Title className='m-4'>Add New Customer</Card.Title>
                <Card.Body className="d-flex flex-row justify-content-center">
                    <CustomerForm
                        custref={custref}
                        firstname={firstname}
                        surname={surname}
                        email={email}
                        company={company}
                        address1={address1}
                        address2={address2}
                        address3={address3}
                        address4={address4}
                        phoneFields={phoneFields}
                        handleChange={this.handleChange.bind(this)}
                        handleSubmit={this.handleSubmit.bind(this)}
                        handleChangePhone={this.handleChangePhone.bind(this)}
                        handleAdd={this.handleAdd.bind(this)}
                        handleSubtract={this.handleSubtract.bind(this)}
                        handleCancel={this.handleCancel.bind(this)}
                    ></CustomerForm>
                </Card.Body>
            </Card >
        )

    }

} export default CustomerCreator