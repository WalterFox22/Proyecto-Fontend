import React from 'react';
import { Table, Card } from 'react-bootstrap';
import { MdNoteAdd, MdInfo, MdDeleteForever } from 'react-icons/md';

const BarraListar = () => {
    return (
        <>
            <Card className="shadow-lg rounded-lg border-0 mt-5">
                <Card.Body>
                    <Table striped bordered hover responsive className="table-sm text-center w-100">
                        <thead className="bg-secondary text-white">
                            <tr>
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
                            {/* Ejemplo de datos */}
                            <tr className="align-middle" style={{ backgroundColor: '#f7f7f7' }}>
                                <td>1</td>
                                <td style={{ backgroundColor: '#e9ecef' }}>Juan Pérez</td>
                                <td style={{ backgroundColor: '#e9ecef' }}>Maria López</td>
                                <td style={{ backgroundColor: '#e9ecef' }}>juan@email.com</td>
                                <td style={{ backgroundColor: '#e9ecef' }}>1234567890</td>
                                <td>
                                    <span className="bg-success text-white text-xs font-weight-bold px-3 py-1 rounded">
                                        Activo
                                    </span>
                                </td>
                                <td className="d-flex justify-content-between align-items-center" style={{ width: '100%' }}>
                                    <MdNoteAdd className="h-9 w-9 text-primary cursor-pointer inline-block mr-3" />
                                    <MdInfo className="h-9 w-9 text-info cursor-pointer inline-block mr-3" />
                                    <MdDeleteForever className="h-9 w-9 text-danger cursor-pointer inline-block" />
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
