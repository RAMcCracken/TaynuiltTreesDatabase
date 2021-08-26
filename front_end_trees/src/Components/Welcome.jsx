import React, { Component } from 'react'
import { Card, Button } from 'react-bootstrap'

class Welcome extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render() {
        return (
            <Card className='m-4'>
                <Card.Title className='m-2'>Taynuilt Trees Database Management System</Card.Title>
                <Card.Body>
                    <Card.Text>Please select a table below to browse data</Card.Text>
                    <Button className="m-3" href="/quotes">Quotes</Button>
                    <Button className="m-3" href="/orders">Orders</Button>
                    <Button className="m-3" href="/customers">Customers</Button>
                </Card.Body>

            </Card>
        )
    }
}

export default Welcome