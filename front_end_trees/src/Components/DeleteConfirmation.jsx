import React from 'react'
import { Modal } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'

function DeleteConfirmation(props) {
    return (
        <Modal
            show={props.showDelete}
            onHide={props.handleClose}
            backdrop="static"
        >
            <Modal.Body>Are you sure you want to delete this {props.table}?</Modal.Body>
            <Modal.Footer>
                <Button onClick={props.handleClose}>No, cancel</Button>
                <Button variant="danger" onClick={props.handleDelete}>Yes, delete {props.table} {props.selectedRef}</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default DeleteConfirmation
