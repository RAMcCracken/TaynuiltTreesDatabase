import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Card from 'react-bootstrap/Card'
import { FormCheck } from 'react-bootstrap'

class CustomersViewer extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <Card className='m-4'>
                <Card.Title className='mt-4'>Customers</Card.Title>
                <Card.Body>
                    View Customer Data Here
                    <Button variant='info' className='m-2'>Edit</Button>
                    <Button variant='danger' className='m-2'>Delete</Button>
                    <Button variant='success' className='m-2'>New</Button>

                    <Table bordered striped className='mt-2'>
                        <thead>
                            <tr>
                                <th>Selected</th>
                                <th>Customer Ref</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Company</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                        </tbody>

                    </Table>
                </Card.Body>
            </Card>
        )
    }
}

export default CustomersViewer