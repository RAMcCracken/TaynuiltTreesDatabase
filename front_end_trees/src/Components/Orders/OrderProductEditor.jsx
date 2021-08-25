// import React, { Component } from 'react'
// import { Row, Col } from 'react-bootstrap';
// import Form from 'react-bootstrap/Form'

// class OrderProductEditor extends Component {
//     constructor(props) {
//         super(props)

//         this.state = {

//         }
//     }

//     render() {
//         return (
//             <Form>
//                 <Form.Label>Product {props.product_code}</Form.Label>
//                 <Form.Group className="mb-3" controlId="product.id">
//                     <Row>
//                         <Col xs={4}>
//                             <Form.Control
//                                 type="text"
//                                 placeholder="Product Code"
//                                 name="product_code"
//                                 value={props.product_code}
//                                 onChange={e => props.handleChangeProduct(i, e)}
//                             />
//                         </Col>
//                         <Col xs={2}>
//                             <Form.Control
//                                 type="number"
//                                 placeholder="Quantity"
//                                 name="quantity"
//                                 value={props.quantity}
//                                 onChange={e => props.handleChangeProduct(i, e)}
//                             />
//                         </Col>
//                         <Col xs={2}>
//                             <Form.Control
//                                 type="text"
//                                 placeholder="Bags"
//                                 name="bags"
//                                 value={props.bags}
//                                 onChange={e => props.handleChangeProduct(i, e)}
//                             />
//                         </Col>


//                         <Col xs={1} className="d-flex flex-col align-self-top">
//                             <Button className="mb-4" disabled={props.id === 1} onClick={() => props.handleSubtract(i)}>Cancel</Button>
//                         </Col>
//                         <Col xs={2} className="d-flex flex-col align-self-top">
//                             <Button
//                                 className="mb-4"
//                                 variant="success"
//                                 type="submit"
//                                 onClick={e => props.handleSubmitOrderProd(e, props.id)}>
//                                 Save</Button>
//                         </Col>
//                     </Row>
//                 </Form.Group>
//             </Form>
//         )
//     }
// }

// export default OrderProductEditor