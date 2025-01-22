import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import FormularioRegistro from '../../componets/Perfil/FormularioRegistro';

const RegistroConductor = () => {
    return (
        <Container fluid>
            {/* Encabezado */}
            <div className="text-center mb-4">
                <h1>Registro Conductor</h1>
                <hr />
                <p>Este módulo te permite visualizar y actualizar al conductor.</p>
            </div>

            {/* Contenido principal */}
            <Row className="justify-content-center align-items-center">
                <Col xs={12} md={6}>
                    <FormularioRegistro />
                </Col>
            </Row>
        </Container>
    );
};

export default RegistroConductor;
