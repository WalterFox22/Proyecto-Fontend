import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const FormularioRegistro = () => {

  const navigate=useNavigate()
  

  const [form, setForm] = useState({
      nombre: '',
      apellido: '',
      rutaAsignada: '',
      sectoresRuta: '',
      telefono: '',
      placaAutomovil: '',
      cedula: '',
      email: '',
  });

    const [imagen, setImagen] = useState(null); // Estado para la imagen

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setImagen(e.target.files[0]); // Guardar la imagen seleccionada
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verificamos si hay algún campo vacío
        for (let key in form) {
            if (form[key] === '') {
                toast.error('Por favor, completa todos los campos');
                return;
            }
        }

        // Creamos un objeto FormData para enviar tanto los datos del formulario como la imagen
        const formDataToSend = new FormData();
        Object.keys(form).forEach((key) => {
            formDataToSend.append(key, form[key]);
        });

        if (imagen) {
            formDataToSend.append('fotografiaDelConductor', imagen); // Agregar la imagen al FormData
        }

        try {
            const token = localStorage.getItem('token'); // Obtener el token de localStorage
            const url = `${import.meta.env.VITE_URL_BACKEND}/registro/conductores`
            const options = {
                headers: {
                    'Content-Type': 'multipart/form-data', // Indicamos que estamos enviando FormData
                    Authorization: `Bearer ${token}`, // Agregar el token de autenticación
                },
            };

            // Enviar los datos al backend
            const response = await axios.post(url, formDataToSend, options);

            // Si la respuesta es exitosa
            if (response.status === 200) {
                toast.success('Conductor registrado con éxito y correo enviado');
                setForm({ // Limpiar el formulario
                    nombre: '',
                    apellido: '',
                    rutaAsignada: '',
                    sectoresRuta: '',
                    telefono: '',
                    placaAutomovil: '',
                    cedula: '',
                    email: '',
                });
                setImagen(null); // Limpiar la imagen
                navigate('/dashboard/listar/conductores');
            }
        } catch (error) {
            // Manejo de errores
            toast.error(error.response?.data?.msg || 'Ocurrió un error al registrar el conductor');
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="nombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="apellido">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                    type="text"
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="rutaAsignada">
                <Form.Label>Ruta Asignada</Form.Label>
                <Form.Control
                    type="text"
                    name="rutaAsignada"
                    value={form.rutaAsignada}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="sectoresRuta">
                <Form.Label>Sectores de la Ruta</Form.Label>
                <Form.Control
                    type="text"
                    name="sectoresRuta"
                    value={form.sectoresRuta}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="telefono">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                    type="text"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="placaAutomovil">
                <Form.Label>Placa del Automóvil</Form.Label>
                <Form.Control
                    type="text"
                    name="placaAutomovil"
                    value={form.placaAutomovil}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="cedula">
                <Form.Label>Cédula</Form.Label>
                <Form.Control
                    type="text"
                    name="cedula"
                    value={form.cedula}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="fotografiaDelConductor" className="mb-3">
                <Form.Label>Fotografía</Form.Label>
                <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                />
                {/* Vista previa de la imagen */}
                {imagen && (
                    <div>
                        <img
                            src={URL.createObjectURL(imagen)}
                            alt="Vista previa"
                            style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px' }}
                        />
                    </div>
                )}
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
    );
};

export default FormularioRegistro;
