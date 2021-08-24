import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import CustomerForm from './CustomerForm'


class CustomerEditor extends Component {
    constructor(props) {
        super(props)
        const data = this.props.location && this.props.location.state ?
            this.props.location.state.data : null

        let phones
        let phone_ids = null
        if (data.phone_numbers) {
            phones = data.phone_numbers.split(",");
            phone_ids = phones.map((phone, i) => {
                const id = i + 1
                return { id, number: phone }
            })
        }

        this.state = {
            phoneFields: phone_ids ? phone_ids : [{ id: 1, number: "" }],
            old_custref: data ? data.customer_ref : "",
            custref: data ? data.customer_ref : "",
            firstname: data ? data.firstname : "",
            surname: data ? data.surname : "",
            email: data ? data.email : "",
            company: data ? data.company : "",
            address1: data ? data.address_number : "",
            address2: data ? data.address_street : "",
            address3: data ? data.address_town : "",
            address4: data ? data.address_postcode : "",
            loading: true
        }
    }

    componentDidMount() {
        this.setState({ loading: false })
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

    handleSubmit = (e) => {
        e.preventDefault();

        let phoneNums = []

        this.state.phoneFields.forEach(element => {
            const number = [this.state.custref, element.number]
            phoneNums = [...phoneNums, number]
        });

        const requestOptions = {
            method: 'PUT',
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
        fetch('/api/customer/' + this.state.old_custref, requestOptions)
            .then(response => {
                response.json();
                if (response.ok) {
                    e.target.reset();
                    this.props.history.push("/customers");
                }
            })


    }
    render() {
        const { custref, firstname, surname, email, company, address1, address2, address3, address4, loading } = this.state
        return (
            <Card className='m-4' >

                <Card.Title className='mt-4'>Edit Customer</Card.Title>
                {loading ? <h4>Loading, please wait</h4> :
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
                            phoneFields={this.state.phoneFields}
                            handleChange={this.handleChange.bind(this)}
                            handleSubmit={this.handleSubmit.bind(this)}
                            handleChangePhone={this.handleChangePhone.bind(this)}
                        ></CustomerForm>
                    </Card.Body>
                }
            </Card >
        )

    }

} export default CustomerEditor