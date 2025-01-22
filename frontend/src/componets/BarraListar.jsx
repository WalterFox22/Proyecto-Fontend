import React from 'react';
import { Table, Card, Form, Button } from 'react-bootstrap';
import Delete from '../assets/Delete.png';
import Update from '../assets/Update.png';

const BarraListar = () => {
    return (
        <>
        <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Buscar Conductor"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">BUSCAR</Button>
          </Form>
            <Card className="shadow-lg rounded-lg border-0 mt-5">
                <Card.Body>
                    <Table striped bordered hover responsive className="table-sm text-center w-100">
                        <thead>
                            <tr style={{ backgroundColor: '#1f2833', color: '#ffffff' }}>
                                <th>N°</th>
                                <th>Nombre</th>
                                <th>Propietario</th>
                                <th>Email</th>
                                <th>Celular</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                                <td>1</td>
                                <td>Juan Pérez</td>
                                <td>Maria López</td>
                                <td>juan@email.com</td>
                                <td>1234567890</td>
                                <td><span className="badge bg-success">Activo</span></td>
                                <td className="d-flex justify-content-center align-items-center" style={{ minWidth: '150px', minHeight:'36px' }}>
                                    <img src={Update} alt="Update" style={{ height: '24px', width: '24px', marginRight: '10px' }} className="cursor-pointer inline-block" />
                                    <img src={Delete} alt="Delete" style={{ height: '24px', width: '24px', marginRight: '10px' }} className="cursor-pointer inline-block" />
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </>
    );
};

export default BarraListar;