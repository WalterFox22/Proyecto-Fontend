import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const FormularioRegistro = () => {


  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    rutaAsignada: '',
    sectoresRuta: '',
    telefono: '',
    placaAutomovil: '',
    cedula: '',
    email: '',
    institucion: 'Unidad Educativa Particular Emaús', // Campo quemado
    generoConductor: '',      // Campo para el género
  });

  // Control de formato para los nombres ingresados
  const FormatoNombres =(str)=>{
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

  }



  const [imagen, setImagen] = useState(null); // Estado para la imagen

  const handleChange = (e) => {
    setForm({
      ...form,
      nombre:FormatoNombres(form.nombre),
      apellido:FormatoNombres(form.apellido),
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
      const url = `${import.meta.env.VITE_URL_BACKEND}/registro/conductores`;
      const options = {
        headers: {
          'Content-Type': 'multipart/form-data', // Indicamos que estamos enviando FormData
          Authorization: `Bearer ${token}`,      // Agregar el token de autenticación
        },
      };

      // Enviar los datos al backend
      const response = await axios.post(url, formDataToSend, options);

      // Si la respuesta es exitosa
      if (response) {
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
          institucion: 'Unidad Educativa Particular Emaús', // Retener el valor quemado
          generoConductor:'',
        });
        setImagen(null); // Limpiar la imagen
        
      }
    } catch (error) {

      // Manejo de errores que manda el backend en diferentes formatos para que se muestre en pantalla:
      if (error.response && error.response.data) {
        const backendResponse = error.response.data;
  
        // Manejar formato con 'errors' (array)
        if (backendResponse.errors && Array.isArray(backendResponse.errors)) {
          backendResponse.errors.forEach((err) => {
            toast.error(err.msg); // Mostrar cada mensaje de error
          });
        } 
        // Manejar otros formatos de error
        else if (backendResponse.msg_registro_conductor) {
          toast.error(backendResponse.msg_registro_conductor); // Mostrar mensaje específico
        } 
        // Manejar formato genérico
        else if (backendResponse.msg) {
          toast.error(backendResponse.msg); // Mostrar mensaje genérico
        } 
        // Si no se reconoce el formato, usar mensaje genérico
        else {
          toast.error('Error desconocido. Por favor, verifica los datos e intenta nuevamente.');
        }
      } else {
        // Errores fuera de la respuesta del backend (por ejemplo, problemas de red)
        toast.error('Error de red. Por favor, intenta nuevamente.');
      }
    }
  };

  return (
    <>
    <ToastContainer/>
    
    <Form onSubmit={handleSubmit}>
      {/* Título y campo Nombre */}
      <Form.Group controlId="nombre" className="mb-3">
        <Form.Label style={{ fontWeight: 'bold' }}>Nombre</Form.Label>
        <Form.Control
          placeholder="Ingrese el Nombre"
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* Título y campo Apellido */}
      <Form.Group controlId="apellido" className="mb-3">
        <Form.Label style={{ fontWeight: 'bold' }}>Apellido</Form.Label>
        <Form.Control
          placeholder="Ingrese el Apellido"
          type="text"
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
          required
        />
      </Form.Group>

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

      {/* Título y campo Teléfono */}
      <Form.Group controlId="telefono" className="mb-3">
        <Form.Label style={{ fontWeight: 'bold' }}>Teléfono</Form.Label>
        <Form.Control
          placeholder="Ingrese el teléfono"
          type="text"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* Título y campo Placa del Automóvil */}
      <Form.Group controlId="placaAutomovil" className="mb-3">
        <Form.Label style={{ fontWeight: 'bold' }}>Placa del Automóvil</Form.Label>
        <Form.Control
          placeholder="Ingrese las placas (solo 7 digitos)"
          type="text"
          name="placaAutomovil"
          value={form.placaAutomovil}
          onChange={handleChange}
          maxLength={7}
          required
        />
      </Form.Group>

      {/* Título y campo Cédula */}
      <Form.Group controlId="cedula" className="mb-3">
        <Form.Label style={{ fontWeight: 'bold' }}>Cédula</Form.Label>
        <Form.Control
          placeholder="Ingrese su cédula (solo 10 digitos)"
          type="text"
          name="cedula"
          value={form.cedula}
          onChange={handleChange}
          maxLength={10}
          required
        />
      </Form.Group>

      {/* Título y campo Email */}
      <Form.Group controlId="email" className="mb-3">
        <Form.Label style={{ fontWeight: 'bold' }}>Email</Form.Label>
        <Form.Control
          placeholder="Ingrese el correo electrónico"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* Título y campo Institución */}
      <Form.Group controlId="institucion" className="mb-3">
        <Form.Label style={{ fontWeight: 'bold' }}>Institución</Form.Label>
        <Form.Control
          type="text"
          name="institucion"
          value={form.institucion}
          readOnly
        />
      </Form.Group>

      {/* Título y campo Género */}
      <Form.Group controlId="genero" className="mb-3">
        <Form.Label style={{ fontWeight: 'bold' }}>Género</Form.Label>
        <Form.Control
          as="select"
          name="generoConductor"
          value={form.genero}
          onChange={handleChange}
          required
        >
          <option value="" style={{ color: '#ccc' }}>Seleccione un género</option> {/* Gris claro */}
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
          <option value="Prefiero no decirlo">Prefiero no decirlo</option>

        </Form.Control>
      </Form.Group>

      {/* Título y campo Fotografía */}
      <Form.Group controlId="fotografiaDelConductor" className="mb-3">
        <Form.Label style={{ fontWeight: 'bold' }}>Fotografía</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          name="fotografiaDelConductor"
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
  );
};

export default FormularioRegistro;
