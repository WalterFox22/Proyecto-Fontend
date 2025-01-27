import React, { useContext } from 'react';
import { Row, Col, Container } from 'react-bootstrap'; // Importa componentes de React-Bootstrap
import AuthContext from '../../context/AuthProvider';

const Perfil = () => {
    const { auth } = useContext(AuthContext);

    return (
        <Container fluid>
            <div className="text-center">
                <h1 className="mb-4">Perfil del Usuario</h1>
                <hr className="my-4" />
                <p className="text-lg mb-8">
                    Este módulo te permite visualizar el perfil del Usuario
                </p>
            </div>

            <Row className="justify-content-center">
                {/* Información del Perfil */}
                <Col md={6}>
                    <div className="p-4 border rounded shadow-lg bg-light">
                        <h2 className="mb-4 text-center">Información del Perfil</h2>
                        {auth.nombre ? (
                            <div style={{ fontSize: '1.2rem' }}>
                                <p><strong>Nombre:</strong> {auth.nombre}</p>
                                <p><strong>Apellido:</strong> {auth.apellido}</p>
                                <p><strong>Teléfono:</strong> {auth.telefono}</p>
                                <p><strong>Email:</strong> {auth.email}</p>
                                <p><strong>Institución:</strong> {auth.institucion}</p>
                            </div>
                        ) : (
                            <p className="text-center" style={{ fontSize: '1.2rem' }}>
                                Cargando datos del perfil...
                            </p>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Perfil;
