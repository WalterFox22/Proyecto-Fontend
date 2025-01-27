import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import BarraListar from '../../componets/BarraListar';
import AuthContext from '../../context/AuthProvider';

const ListarCondutor = () => {

    const {auth}=useContext(AuthContext)

    return (
        <Container fluid>
            {/* Encabezado */}
            <div className="text-center mb-4">
                <h1>Lista de Conductores</h1>
                <h5>Unidad Educativa Particular Emaús</h5>
                <hr />
                <p>Este módulo te permite visualizar la lista de conductores.</p>
            </div>

            {/* Contenido principal */}
            <Row className="justify-content-center">
                <Col xs={12} md={12} lg={10}>   
                    {/* BarraListar ocupa todo el ancho dentro de la columna */}
                    {auth.nombre ? (
                        <BarraListar />
                    )
                    :(
                        <p className="text-center" style={{ fontSize: '1.2rem' }}>
                                Cargando datos del perfil...
                        </p>

                    )}
                    
                </Col>
            </Row>
        </Container>
    );
};

export default ListarCondutor;
