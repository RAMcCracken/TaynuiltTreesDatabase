import React, { Component } from 'react'
import { Card, Button, Container } from 'react-bootstrap'

class Welcome extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render() {
        return (
            <Container className="d-flex justify-content-center">
                <Card className='m-4 w-100 text-center'>
                    <Card.Title className='mt-4'>Taynuilt Trees Database Management System</Card.Title>
                    <Card.Body>
                        <Card.Text>Please select a table below to browse data</Card.Text>
                        <Button className="m-3" href="/quotes">Quotes</Button>
                        <Button className="m-3" href="/orders">Orders</Button>
                        <Button className="m-3" href="/customers">Customers</Button>
                    </Card.Body>

                </Card>
            </Container>

        )
    }
}

export default Welcome