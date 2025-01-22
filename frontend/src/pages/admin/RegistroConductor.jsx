import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import LoadingPhoto from '../../componets/Perfil/LoadingPhoto';

const RegistroConductor = () => {
    return (
      <Container fluid>
        <div className="text-center mb-4">
          <h1>Registro Conductor</h1>
          <hr />
          <p>Este módulo te permite visualizar y actualizar al conductor.</p>
        </div>
        <Row className="justify-content-center align-items-center">
          <Col xs={12}>
            <LoadingPhoto />
          </Col>
        </Row>
      </Container>
    );
  };
  
  export default RegistroConductor;