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

                        <h1 className="text-center my-5 display-4">Registro</h1>
                        <Form className="mx-auto" style={{ maxWidth: '500px' }}>
                            <Form.Group as={Row} className="mb-4 align-items-center" controlId="formHorizontalNombre">
                                <Form.Label column sm={3} className="fw-semibold text-end">
                                    Nombre
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control type="text" className="py-2" />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-4 align-items-center" controlId="formHorizontalApellido">
                                <Form.Label column sm={3} className="fw-semibold text-end">
                                    Apellido
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control type="text" className="py-2" />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-4 align-items-center" controlId="formHorizontalTelefono">
                                <Form.Label column sm={3} className="fw-semibold text-end">
                                    Teléfono
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control type="text" className="py-2" />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-4 align-items-center" controlId="formHorizontalCedula">
                                <Form.Label column sm={3} className="fw-semibold text-end">
                                    Cédula
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control type="text" className="py-2" />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-4 align-items-center" controlId="formHorizontalEmail">
                                <Form.Label column sm={3} className="fw-semibold text-end">
                                    Email
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control type="email" placeholder="@" className="py-2" />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-4 align-items-center" controlId="formHorizontalPassword">
                                <Form.Label column sm={3} className="fw-semibold text-end">
                                    Password
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control type="password" placeholder="*********" className="py-2" />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mt-3">
                                <Col sm={{ span: 12, offset: 0 }} className="text-center">
                                    <Button type="submit" variant="success" className="btn-lg px-5 py-3" style={{ fontWeight: 'bold', borderRadius: '10px', fontSize: '18px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', }}>
                                        Registrar
                                    </Button>
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