import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Form, Button } from 'react-bootstrap';
import Mensaje from "../Alertas/Mensaje";


const FormularioRutaSector =({conductores})=>{
    // Validar si me esta mando el valor id = console.log(conductores._id);

    const navigate = useNavigate()
    const [mensaje, setMensaje]=useState({})
    const [loading, setLoading] = useState(true);
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
            toast.success('Ruta y Secto del Conductor actualizado con éxito');
            //navigate('/dashboard/listar/conductores')

          } catch (error) {
            console.error('Error al actualizar', error.response?.data);
            setMensaje({ respuesta: error.response?.data?.msg || 'Error al actualizar', tipo: false });
            toast.error(error.response?.data?.msg || 'Error al actualizar el conductor');
        }finally {
            setLoading(false);
        }
        
        
    }

    return (
        <>
        <ToastContainer/>
        <Form onSubmit={handleSubmit}>
            {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}
            
            {/* Título y campo Ruta Asignada */}
            <Form.Group controlId="rutaAsignada" className="mb-3 text-center">
                <Form.Label style={{ fontWeight: 'bold', display: 'block' }}>Ruta Asignada</Form.Label>
                <Form.Control
                placeholder="Ingrese la ruta (Ejm: 11)"
                type="text"
                name="rutaAsignada"
                value={form.rutaAsignada}
                onChange={handleChange}
                maxLength={2}
                required
                style={{
                    maxWidth: '400px', 
                    margin: '0 auto', 
                    textAlign: 'center'
                }}
                />
            </Form.Group>

            {/* Título y campo Sectores de la Ruta */}
            <Form.Group controlId="sectoresRuta" className="mb-3 text-center">
                <Form.Label style={{ fontWeight: 'bold', display: 'block' }}>Sectores de la Ruta</Form.Label>
                <Form.Control
                placeholder="Ingrese el sector (Ejm: La Mariscal)"
                type="text"
                name="sectoresRuta"
                value={form.sectoresRuta}
                onChange={handleChange}
                required
                style={{
                    maxWidth: '400px', 
                    margin: '0 auto', 
                    textAlign: 'center'
                }}
                />
            </Form.Group>
            <Button
                type="submit"
                variant="success"
                className="mx-auto d-block" 
                style={{
                    width: '200px', // Ajusta según necesites
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '10px 20px' // Ajustar relleno
                }}
            >
                Registrar
            </Button>
        </Form>
        </>

    )
}

export default FormularioRutaSector