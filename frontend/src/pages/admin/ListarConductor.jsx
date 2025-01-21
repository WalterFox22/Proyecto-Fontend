import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import BarraListar from '../../componets/BarraListar';

const ListarCondutor = () => {
    return (
        <Container fluid>
            {/* Encabezado */}
            <div className="text-center mb-4">
                <h1 className="text-dark">Lista de Conductores</h1>
                <hr />
                <p>Este módulo te permite visualizar la lista de conductores.</p>
            </div>

            {/* Contenido principal */}
            <Row className="justify-content-center">
                <Col xs={12} md={10} lg={8}>
                    {/* BarraListar ocupa todo el ancho dentro de la columna */}
                    <BarraListar />
                </Col>
            </Row>
        </Container>
    );
};

export default ListarCondutor;
