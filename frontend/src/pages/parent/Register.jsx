import {Button, Col, Form, Row, Image, Container} from 'react-bootstrap'
import Imagen1 from '../../assets/EMAUS.png'





const Register = () =>{


    return(
        <>
            <Container fluid className="vh-100 p-0">
                <Row className="h-100 m-0"> 
                    <Col xs={12} md={6} className="p-0">
                    <Image src={Imagen1} className="w-100 h-100" style={{ objectFit: 'cover'}}/>
                    </Col>
                    <Col xs={12} md={6} className="p-0">
                        <Form>
                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                                <Form.Label column sm={2}>
                                Email
                                </Form.Label>
                                <Col sm={10}>
                                <Form.Control type="email" placeholder="Email" />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
                                <Form.Label column sm={2}>
                                Password
                                </Form.Label>
                                <Col sm={10}>
                                <Form.Control type="password" placeholder="Password" />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
                                <Form.Label column sm={2}>
                                Password
                                </Form.Label>
                                <Col sm={10}>
                                <Form.Control type="password" placeholder="Password" />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
                                <Form.Label column sm={2}>
                                Password
                                </Form.Label>
                                <Col sm={10}>
                                <Form.Control type="password" placeholder="Password" />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
                                <Form.Label column sm={2}>
                                Password
                                </Form.Label>
                                <Col sm={10}>
                                <Form.Control type="password" placeholder="Password" />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
                                <Form.Label column sm={2}>
                                Password
                                </Form.Label>
                                <Col sm={10}>
                                <Form.Control type="password" placeholder="Password" />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
                                <Form.Label column sm={2}>
                                Password
                                </Form.Label>
                                <Col sm={10}>
                                <Form.Control type="password" placeholder="Password" />
                                </Col>
                            </Form.Group>
                            

                            <Form.Group as={Row} className="mb-3">
                                <Col sm={{ span: 20, offset: 2 }}>
                                <Button type="submit">Sign in</Button>
                                </Col>
                            </Form.Group>
                        </Form>
                        




                    </Col>
                </Row>
            </Container>
            
        
        </>
    )

}



export default Register;