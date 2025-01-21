import React from 'react';
import { Form, Button } from 'react-bootstrap'; // Importa componentes de React-Bootstrap

const FormularioPerfil = () => {
    
    return (
        <Form>
            <Form.Group className="mb-3" controlId="nombre">
                <Form.Label className="text-gray-700 uppercase font-bold text-sm">Nombre:</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Nombre"
                    name="nombre"
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="apellido">
                <Form.Label className="text-gray-700 uppercase font-bold text-sm">Apellido:</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Apellido"
                    name="apellido"
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="direccion">
                <Form.Label className="text-gray-700 uppercase font-bold text-sm">Dirección:</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Dirección"
                    name="direccion"
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="telefono">
                <Form.Label className="text-gray-700 uppercase font-bold text-sm">Teléfono:</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Teléfono"
                    name="telefono"
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
                <Form.Label className="text-gray-700 uppercase font-bold text-sm">Email:</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Email"
                    name="email"
                />
            </Form.Group>

            <Button
                type="submit"
                variant="success"
                className="w-100 " 
                style={{
                    color: "white", // Texto blanco
                    border: "none", // Sin borde
                    borderRadius: "5px", // Bordes redondeados
                    
                }}
            >
                Actualizar
            </Button>
        </Form>
    );
};

export default FormularioPerfil;
