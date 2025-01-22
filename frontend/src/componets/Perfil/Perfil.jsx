import React, { useContext } from 'react';
import { Row, Col, Container } from 'react-bootstrap'; // Importa componentes de React-Bootstrap
import AuthContext from '../../context/AuthProvider';

const Perfil = () => {
    const { auth } = useContext(AuthContext);

    return (
        <Container fluid>
            <div className="text-center">
                <h1 className="font-black text-5xl text-gray-500 mb-4">Perfil</h1>
                <hr className="my-4" />
                <p className="text-lg mb-8">
                    Este módulo te permite visualizar el perfil del Usuario
                </p>
            </div>

            <Row className="justify-content-center">
                {/* Información del Perfil */}
                <Col md={6}>
                    <div className="p-4 border rounded shadow-lg bg-light">
                        <h2 className="text-3xl font-bold mb-4 text-center">Información del Perfil</h2>
                        
                            <div style={{ fontSize: '1.2rem' }}>
                                <p><strong>Nombre:</strong> {auth.nombre}</p>
                                <p><strong>Apellido:</strong> {auth.apellido}</p>
                                <p><strong>Teléfono:</strong> {auth.telefono}</p>
                                <p><strong>Email:</strong> {auth.email}</p>
                                <p><strong>Institución:</strong> {auth.institucion}</p>
                            </div>
                       
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Perfil;
