import React, { useEffect, useState } from 'react';
import { Table, Card, Form, Button } from 'react-bootstrap';
import Delete from '../assets/borrar1.png';
import Update from '../assets/actualizar.png';
import { useNavigate } from 'react-router-dom';


//import Delete  from '../assets/remover.png';

import axios from 'axios';
import Mensaje from './Alertas/Mensaje';


const BarraListar = () => {

  const navigate= useNavigate()
  const [conductores, setConductores] = useState([])
  const [rutaAsignada, setRutaAsignada] = useState(''); // Ruta que se ingresa para búsqueda
  const [error, setError] = useState(null)


  // Función para listar conductores desde el backend
  const listarConductores = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = `${import.meta.env.VITE_URL_BACKEND}/listar/conductores`;
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const respuesta = await axios.get(url, options);

      // Validamos que la respuesta contiene la propiedad "conductores" y es un arreglo
      if (respuesta.data && Array.isArray(respuesta.data.conductores)) {
        setConductores(respuesta.data.conductores);
      } else {
        throw new Error('La respuesta del servidor no contiene un arreglo de conductores');
      }
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al cargar los conductores. Intente nuevamente.');
    }
  };

  

  // Buscar conductor por la ruta ingresada
  const buscarConductorPorRuta = async () => {
    if (!rutaAsignada) {
      // Si no hay nada en el input, no realizar la búsqueda
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const url = `${import.meta.env.VITE_URL_BACKEND}/buscar/conductor/ruta/${rutaAsignada}`;
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const respuesta = await axios.get(url, options);

      if (respuesta.data && respuesta.data.conductores) {
        setConductores(respuesta.data.conductores);
      } else {
        setConductores([]);
        setError('No se encontraron conductores para la ruta especificada');
      }
    } catch (err) {
      console.error(err);
      setError('Error al buscar el conductor. Intente nuevamente.');
    }
  };

  // Filtrar los conductores solo por la ruta asignada
const conductoresFiltrados = conductores.filter((conductor) =>
  String(conductor.rutaAsignada).toLowerCase().includes(rutaAsignada.toLowerCase())
);


  // Borrar Conductor de la base de datos 
  const handleDelete = async (id) => {
    try {
        // Alerta de enviar antes de eliminar para evitar errores  
        const confirmar = confirm("Vas a eliminar a un conductor, ¿Estás seguro de realizar esta acción?")
        if (confirmar) {
            // definicion del token
            const token = localStorage.getItem('token')
            // establecer la ruta de acceso al backend
            const url = `${import.meta.env.VITE_URL_BACKEND}/eliminar/conductor/${id}`
            // Enviamos la solicitud al backend definicion de objeto para los headers
            const headers= {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
           
            // recibimos la respuesta del backend
            await axios.delete(url, {headers});
            listarConductores()
        }
    }
    catch (error) {
        console.log(error);
    }
};



  // Efecto para cargar los conductores al montar el componente
  useEffect(() => {
    listarConductores();
  }, []);

  return (
    <>
      
      {/* Barra de búsqueda */}
      <Form className="d-flex mb-3">
        <Form.Control
          type="search"
          placeholder="Buscar Conductor por ruta"
          className="me-2"
          aria-label="Search"
          value={rutaAsignada}
          onChange={(e) => setRutaAsignada(e.target.value)}
        />
        <Button variant="outline-success" 
          style={{color: '#92BFF9', borderColor: '#92BFF9', backgroundColor: 'transparent',}}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#92BFF9';
            e.target.style.color = '#fff';
            e.target.style.borderColor = '#92BFF9';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#92BFF9';
            e.target.style.borderColor = '#92BFF9';
          }}
          onClick={buscarConductorPorRuta}> {/** SE INVOCA ACA LA FUNCION BUCAR Y NO EN EL USEEFFECT */}
          BUSCAR
        </Button>
      </Form>

      {/* Mostrar mensaje de error si ocurre */}
      {error && <Mensaje tipo="danger">{error}</Mensaje>}

      {/* Mostrar mensaje si no hay conductores */}
      {conductores.length === 0 && !error && <Mensaje tipo="info">{'No existen registros'}</Mensaje>}

      {/* Tabla de conductores */}
      {conductores.length > 0 && (
        <Card className="shadow-lg rounded-lg border-0 mt-3">
          <Card.Body>
            <Table striped bordered hover responsive className="table-sm text-center w-100">
              <thead>
                <tr style={{ backgroundColor: '#1f2833', color: '#ffffff' }}>
                  <th>N°</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Cédula</th>
                  <th>Ruta</th>
                  <th>Sector</th>
                  <th>Placa Vehicular</th>
                  
                  <th>Correo</th>
                 
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {conductoresFiltrados.map((conductor, index) => (
                  <tr style={{ backgroundColor: '#f8f9fa' }} key={conductor._id}>
                    <td>{index + 1}</td>
                    <td>{conductor.nombre}</td>
                    <td>{conductor.apellido}</td>
                    <td>{conductor.cedula}</td>
                    <td>{conductor.rutaAsignada}</td>
                    <td>{conductor.sectoresRuta}</td>
                    <td>{conductor.placaAutomovil}</td>
                    
                    <td>{conductor.email}</td>
                   
                    <td className="d-flex justify-content-center align-items-center" style={{ minWidth: '150px' }}>
                      <img
                        src={Update}
                        alt="Update"
                        style={{ height: '20px', width: '20px', marginRight: '7px', cursor: 'pointer' }}
                        className="cursor-pointer inline-block"
                        onClick={() =>navigate(`/dashboard/buscar/conductor/ruta/${conductor.rutaAsignada}`)}
                      />
                      
                      <img
                        src={Delete}
                        alt="Delete"
                        style={{ height: '20px', width: '20px', marginRight: '7px', cursor:'pointer'}}
                        className="cursor-pointer inline-block"
                        onClick={() => {handleDelete(conductor._id)}}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default BarraListar;
