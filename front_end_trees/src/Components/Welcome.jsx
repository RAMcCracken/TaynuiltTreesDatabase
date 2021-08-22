import React, { Component } from 'react'
import { Card } from 'react-bootstrap'

class Welcome extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render() {
        return (
            <Card className='m-4'>
                <Card.Title className='mt-2'>Taynuilt Trees Database Management System</Card.Title>
                <Card.Body>Please select a table below to browse data</Card.Body>
            </Card>
        )
    }
}

export default Welcome