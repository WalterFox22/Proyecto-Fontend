import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const FormularioRegistro = ({ imageFile }) => {
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState({});
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    rutaAsiganda: "", 
    sectoresRuta: "",
    telefono: "", 
    placaAutomovil: "",
    cedula: "",
    email: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(form).includes("") || !imageFile) {
      setMensaje({ respuesta: "Todos los campos deben ser ingresados y se debe subir una imagen", tipo: false });
      setTimeout(() => {
        setMensaje({});
      }, 3000);
      return;
    }

    // Para las imagenes
    const formData = new FormData();
    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });
    formData.append('fotografiaDelConductor', imageFile);

    try {
      const token = localStorage.getItem('token');
      const url = `${import.meta.env.VITE_URL_BACKEND}/registro/conductores`;
      const options = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.post(url, formData, options);
      setMensaje({ respuesta: "Conductor registrado con éxito y correo enviado", tipo: true });
      navigate('/dashboard/listar/conductores');
    } catch (error) {
      setMensaje({ respuesta: error.response.data.msg, tipo: false });
      toast.error(error.response.data?.msg);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="nombre">
        <Form.Label className="text-gray-700 uppercase font-bold text-sm">Nombre:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="apellido">
        <Form.Label className="text-gray-700 uppercase font-bold text-sm">Apellido:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Apellido"
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="rutaAsiganda">
        <Form.Label className="text-gray-700 uppercase font-bold text-sm">Ruta de trasporte:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ruta"
          name="rutaAsiganda"
          value={form.rutaAsiganda}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="sectoresRuta">
        <Form.Label className="text-gray-700 uppercase font-bold text-sm">Sector:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Sector"
          name="sectoresRuta"
          value={form.sectoresRuta}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="telefono">
        <Form.Label className="text-gray-700 uppercase font-bold text-sm">Teléfono:</Form.Label>
        <Form.Control
          type="tel"
          placeholder="Teléfono"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="placaAutomovil">
        <Form.Label className="text-gray-700 uppercase font-bold text-sm">Placa del Autómovil:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Placa"
          name="placaAutomovil"
          value={form.placaAutomovil}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="cedula">
        <Form.Label className="text-gray-700 uppercase font-bold text-sm">Cédula:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Cedula del conductor"
          pattern="\d{10}"
          name="cedula"
          value={form.cedula}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="email">
        <Form.Label className="text-gray-700 uppercase font-bold text-sm">Email:</Form.Label>
        <Form.Control
          type="email"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
      </Form.Group>
      <Button
        type="submit"
        variant="success"
        className="w-100"
        style={{
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Registrar
      </Button>
    </Form>
  );
};

export default FormularioRegistro;