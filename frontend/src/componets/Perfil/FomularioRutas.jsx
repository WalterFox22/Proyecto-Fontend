import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Form, Button } from 'react-bootstrap';
import Mensaje from "../Alertas/Mensaje";


const FormularioRutaSector =({conductores})=>{
    // Validar si me esta mando el valor id = console.log(conductores._id);


    const [mensaje, setMensaje]=useState({})
    const [form, setForm] = useState({
       
        rutaAsignada: conductores?.rutaAsignada || '',
        sectoresRuta: conductores?.sectoresRuta || '',
    });


    const handleChange = (e) => {
        setForm({
        ...form,
        [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.rutaAsignada.match(/^\d+$/)) {
            setMensaje({ respuesta: 'La ruta debe contener solo números', tipo: false });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_URL_BACKEND}/actualizar/conductor/${conductores._id}`;
            const options = {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            };
            await axios.patch(url, form, options);
            setMensaje({ respuesta: 'Conductor actualizado con éxito', tipo: true });
            toast.success('Conductor actualizado con éxito');
          } catch (error) {
            console.error('Error al actualizar', error.response?.data);
            setMensaje({ respuesta: error.response?.data?.msg || 'Error al actualizar', tipo: false });
            toast.error(error.response?.data?.msg || 'Error al actualizar el conductor');
        }
        
        
    }

    return (
        <>
        <ToastContainer/>
        <Form onSubmit={handleSubmit}>
            {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}
            
            {/* Título y campo Ruta Asignada */}
            <Form.Group controlId="rutaAsignada" className="mb-3">
                <Form.Label style={{ fontWeight: 'bold' }}>Ruta Asignada</Form.Label>
                <Form.Control
                placeholder="Ingrese la ruta (Ejm: 11)"
                type="text"
                name="rutaAsignada"
                value={form.rutaAsignada}
                onChange={handleChange}
                maxLength={2}
                required
                />
            </Form.Group>

            {/* Título y campo Sectores de la Ruta */}
            <Form.Group controlId="sectoresRuta" className="mb-3">
                <Form.Label style={{ fontWeight: 'bold' }}>Sectores de la Ruta</Form.Label>
                <Form.Control
                placeholder="Ingrese el sector (Ejm: La Mariscal)"
                type="text"
                name="sectoresRuta"
                value={form.sectoresRuta}
                onChange={handleChange}
                required
                />
            </Form.Group>
            <Button
                type="submit"
                variant="success"
                className="w-100"
                style={{
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                }}
            >
                Registrar
            </Button>
        </Form>
        </>

    )
}

export default FormularioRutaSector