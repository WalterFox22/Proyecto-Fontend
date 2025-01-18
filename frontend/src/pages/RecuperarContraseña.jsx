import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Fondo2 from "../assets/Imagen3.jpg"; // Imagen importada
import Footer from "./Footer";

const RecuperarContra = () => {
  return (
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
            <Form>
              
              <Form.Group className="mb-3">
                <Form.Label className="text-black fw-bold">Email:</Form.Label> {/* Título en negro */}
                <Form.Control type="email" placeholder="Ingresa tu email" />
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
                variant="outline-primary"
                href="/"
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
  );
};

export default RecuperarContra;
