import React, { useContext } from 'react';
import { Row, Col, Container } from 'react-bootstrap'; // Importa componentes de React-Bootstrap
import AuthContext from '../../context/AuthProvider';
import FormularioPerfil from './FormularioPerfil';

const Perfil = () => {
    const { auth } = useContext(AuthContext);

    return (
        <Container fluid>
            <div>
                <h1 className="font-black text-4xl text-gray-500">Perfil</h1>
                <hr className="my-4" />
                <p className="mb-8">
                    Este módulo te permite visualizar y actualizar el perfil del Administrador
                </p>
            </div>

            <Row>
                {/* Información del Perfil */}
                <Col md={6} className="border-end pe-4">
                    <h2 className="text-2xl font-bold">Información del Perfil</h2>
                    {auth.nombre ? (
                        <div>
                            <p><strong>Nombre:</strong> {auth.nombre}</p>
                            <p><strong>Apellido:</strong> {auth.apellido}</p>
                            <p><strong>Teléfono:</strong> {auth.telefono}</p>
                            <p><strong>Email:</strong> {auth.email}</p>
                        </div>
                    ) : (
                        <p>Cargando datos del perfil...</p>
                    )}
                </Col>

                {/* Formulario de Actualización */}
                <Col md={6}>
                    <h2>Aquí puedes actualizar tu perfil.</h2>
                    <FormularioPerfil />
                </Col>
            </Row>
        </Container>
    );
};

export default Perfil;