import React, { useState } from "react";

import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Fondo2 from "../../assets/Imagen4.jpg"; 
import Footer from "../Footer";
import axios from "axios";
import { Link } from "react-router-dom";

const Register = () =>{


    const [form, setForm]=useState({
        nombre:"",
        apellido:"",
        telefono:"",
        cedula:"",
        email:"",
        password:"",
        cedulaRepresentado:""
    })

    //Verificacion del mensaje
    const [mensaje, setMensaje]= useState("")

    // Paso 2 guarda la informacion captada
    const handleChange = (e) =>{
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
    }

    // Paso 3 envio a backend de la informacion 
    const handleSubmit = async (e)=>{
        e.preventDefault()
        try {
            const url = `${import.meta.env.VITE_URL_BACKEND}/registro/representantes`
            const respuesta = await axios.post(url,form)
            console.log(respuesta)
            setMensaje({
                respuesta:respuesta.data.msg,
                tipo:true
            })
        } catch (error) {
            console.log(error)
            setMensaje({
                respuesta:error.response.data.msg,
                tipe:false
            })
        }
    }




    return(
        <>
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
                {Object.keys(mensaje).length>0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}
                <h1
                    className="text-center mb-4"
                    style={{ fontWeight: "700", fontSize: "2rem", color: "black" }} // Título "Welcome" en negro
                >
                    Registrar Usuario
                </h1>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-black fw-bold">Nombre:</Form.Label> {/* Título en negro */}
                            <Form.Control name="nombre" value={form.nombre || ""} onChange={handleChange} type="text" placeholder="Ingrese su Nombre" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-black fw-bold">Apellido:</Form.Label> {/* Título en negro */}
                            <Form.Control name="apellido" value={form.apellido || ""} onChange={handleChange} type="text" placeholder="Ingresa tu apellido" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-black fw-bold">Cedular:</Form.Label> {/* Título en negro */}
                            <Form.Control name="cedula" value={form.cedula || ""} onChange={handleChange} type="text" placeholder="Cedula del representante" pattern="\d{10}" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-black fw-bold">Teléfono:</Form.Label> {/* Título en negro */}
                            <Form.Control name="telefono" value={form.telefono || ""} onChange={handleChange} type="tel" placeholder="Ingresa tu teléfono" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-black fw-bold">Email:</Form.Label> {/* Título en negro */}
                            <Form.Control name="email" value={form.email || ""} onChange={handleChange} type="email" placeholder="Ingresa tu email" />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label className="text-black fw-bold">Contraseña:</Form.Label> {/* Título en negro */}
                            <Form.Control name="password" value={form.password || ""} onChange={handleChange} type="password" placeholder="********************" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-black fw-bold">Cedula del Representado:</Form.Label> {/* Título en negro */}
                            <Form.Control name="cedulaRepresentado" value={form.cedulaRepresentado || ""} onChange={handleChange} type="text" placeholder="Cedula del estudiante" pattern="\d{10}"/>
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
                            Register
                        </Button>
                    </Form>
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
    )

}



export default Register;