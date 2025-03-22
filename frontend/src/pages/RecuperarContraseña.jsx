import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Fondo2 from "../assets/Imagen3.jpg"; // Imagen importada
import Footer from "./Footer";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import Loading from "../componets/Loading/Loading";

const RecuperarContra = () => {

  const [mensaje, setMensaje]= useState("")
  const {loading}=useContext(AuthContext)

  //Paso 1 capturar la informacion

  const [mail, setMail]=useState({})


  //Paso 2 guardar la informacion caputurada 

  const handleChange= (e)=>{
    setMail({
      ...mail,
      [e.target.name]:e.target.value
    })
  }

  // Paso 3 Envio de la informacion a backend

  const handleSubmit = async (e)=>{
    e.preventDefault() // Para evitar que se pierda la info al recargar 
    try {
      const url = `${import.meta.env.VITE_URL_BACKEND}/recuperacion/contrasenia`
      const respuesta = await axios.post(url,mail)
      toast.success(respuesta.data.msg)
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.msg)
    }
  }

  // Para la pantalla de carga
  useEffect(() => {
    if (!loading) {
      // Se puede hacer alguna lógica aquí si es necesario cuando la carga termina.
    }
  }, [loading]);

  if (loading) {
    return (
      <Loading/>
    ); 
  }


  
  return (
    <>
    <ToastContainer></ToastContainer>
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
      }}
    >
      {/* Contenedor principal */}
      <Row
        className="flex-grow-1"
        style={{
          display: "flex",
          margin: "0",
          flexDirection: "row",
        }}
      >
        {/* Columna izquierda: Formulario */}
        <Col
          xs={12}
          md={6}
          style={{
            backgroundColor: "#f8f9fa",
            padding: "2rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Container style={{ maxWidth: "400px" }}>
          <h1
            className="text-center mb-4"
            style={{ fontWeight: "700", fontSize: "2rem", color: "black" }} // Título "Welcome" en negro
          >
            Recuperacion de Contraseña
          </h1>
            <Form onSubmit={handleSubmit}>
              
              <Form.Group className="mb-3">
                <Form.Label className="text-black fw-bold">Email:</Form.Label> {/* Título en negro */}
                <Form.Control name='email' onChange={handleChange} type="email" placeholder="Ingresa tu email" />
              </Form.Group>
              
              <Button
                variant="primary"
                type="submit"
                className="w-100 mb-3"
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  background: "linear-gradient(45deg, #4caf50, #81c784)",  // Estilo del botón
                  color: "white",  // Color de texto
                  border: "none",  // Eliminar borde
                  borderRadius: "100px",  // Borde redondeado
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                  transition: "0.3s",
                }}
              >
                Enviar
              </Button>

                <div className="text-center">
                <p className="text-secondary mb-2">¿Ya tienes una cuenta?</p>
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-primary"
                  style={{ fontWeight: "600", fontSize: "0.9rem" }}
                >
                  Login
                </Button>
              </div>
            </Form>
            
          </Container>
        </Col>

        {/* Columna derecha: Imagen */}
        <Col
          xs={12}
          md={6}
          style={{
            backgroundImage: `url(${Fondo2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "100%",
          }}
        ></Col>
      </Row>

      <Footer />
    </div>
    </>
  );
};

export default RecuperarContra;
