import { Button, Col, Form, Row, Image, Container } from 'react-bootstrap';
import React from 'react';
import Fondo2 from '../assets/Imagen2.jpg'; // Cambia por tu imagen de mejor calidad

const RecuperarContraseña = () => {
  return (
    <>
      <Container fluid className="vh-100 p-0">
        <Row className="h-100 m-0">
          {/* Columna de la imagen */}
          <Col xs={12} md={6} className="p-0">
            <Image
              src="https://image.isu.pub/140721180844-827232ba155ccf9840de108c501b26b1/jpg/page_1_thumb_large.jpg"
              className="w-100 h-100"
              style={{ objectFit: 'cover' }}
            />
          </Col>

          {/* Columna del formulario */}
          <Col xs={12} md={6} className="d-flex justify-content-center align-items-center p-4">
            <div
              className="w-100"
              style={{
                maxWidth: '500px',
                padding: '30px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'center',
              }}
            >
               <h1
                className="text-center mb-4"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: '700', 
                  fontSize: '3rem', 
                  color: '#333',
                  letterSpacing: '1px', 
                  textTransform: 'uppercase',
                }}
              >Recuperar Contraseña</h1>

              <Form>
                {/* Campo de Email */}
                <Form.Group as={Row} className="mb-4" controlId="formHorizontalEmail">
                  <Form.Label column sm={3} className="fw-semibold text-end">
                    Email
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="email"
                      placeholder="Ingrese su correo electrónico"
                      className="py-2"
                    />
                  </Col>
                </Form.Group>

                {/* Mensaje informativo */}
                <div className="mb-4" >
                  <p style={{ color: '#666', fontSize: '0.9rem', textShadow:"none" }}>
                    Verifique su correo electrónico para cambiar la contraseña
                  </p>
                </div>

                {/* Botón */}
                <Form.Group as={Row} className="mt-3">
                  <Col sm={{ span: 12 }} className="text-center">
                    <Button variant="success" className="w-100 py-2">
                      Enviar
                    </Button>
                  </Col>
                </Form.Group>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default RecuperarContraseña;
