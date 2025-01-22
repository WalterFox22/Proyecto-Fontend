import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const FormularioRegistro = () => {

  // PASO 1 EXTRAER LA INFORMACION
  const navigate= useNavigate()

  const [mensaje, setMensaje]=useState({})
  const [form, setForm]=useState({
      nombre:"",
      apellido:"",
      rutaAsiganda:"", 
      sectoresRuta:"",
      telefono:"", 
      placaAutomovil:"",
      cedula:"",
      email:""

  })

  //PASO 2 GUARDAR LA INFORMACION

  const handleChange = (e)=>{
      setForm({
          ...form,
          [e.target.name]:e.target.value
      })
  }

  // Paso 3 Envio al backend
  const handleSubmit= async (e)=>{
      e.preventDefault()

      try{
      const token = localStorage.getItem('token')
      // Evalua si existe campos vacios
      const url = `${import.meta.env.VITE_URL_BACKEND}/registro/conductores`
          const options={
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
              }
          }
          await axios.post(url,form,options)
    setMensaje({ respuesta:"Conductor registrado con exito y correo enviado", tipo: true })
          navigate('/dashboard/listar/conductores')
         
      } catch (error) {
    setMensaje({ respuesta: error.response.data.msg, tipo: false })
          toast.error(error.response.data?.msg)
      }
  }



  
  
  return (
      <Form onChange={handleSubmit}>
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

export default FormularioRegistro;