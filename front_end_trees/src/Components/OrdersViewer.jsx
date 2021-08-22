import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Card from 'react-bootstrap/Card'
import { Accordion } from 'react-bootstrap'

class OrdersViewer extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <Card className='m-4'>
                <Card.Title className='mt-4'>Orders</Card.Title>
                <Card.Body>
                    View Order Data Here
                    <Button variant='info' className='m-2'>Edit</Button>
                    <Button variant='danger' className='m-2'>Delete</Button>
                    <Button variant='success' className='m-2'>New</Button>

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
                                <th>Order Items</th>
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

export default OrdersViewer