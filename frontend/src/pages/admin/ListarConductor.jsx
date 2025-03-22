import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import BarraListar from '../../componets/BarraListar';
import AuthContext from '../../context/AuthProvider';
import Loading from '../../componets/Loading/Loading';

const ListarCondutor = () => {

    const { auth } = useContext(AuthContext);

    return (
        <Container fluid className="p-3">
            {/* Encabezado */}
            <div className="text-center mb-4">
                <h1>Lista de Conductores</h1>
                <h5>Unidad Educativa Particular Emaús</h5>
                <hr />
                <p>Este módulo te permite visualizar la lista de conductores.</p>
            </div>

            {/* Contenido principal */}
            <Row className="justify-content-center">
                <Col xs={12}>  {/* Ahora la columna ocupa todo el ancho en todos los tamaños de pantalla */}
                    {/* BarraListar ocupa todo el ancho dentro de la columna */}
                    {auth.conductor.nombre ? (
                        <BarraListar />
                    ) : (
                        <Loading />
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default ListarCondutor;
