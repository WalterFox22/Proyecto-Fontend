import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Fondo2 from "../assets/Imagen2.jpg"; // Imagen importada
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
              className="text-center text-primary mb-4"
              style={{ fontWeight: "700", fontSize: "2rem" }}
            >
              Welcome
            </h1>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="text-secondary fw-bold">Name:</Form.Label>
                <Form.Control type="text" placeholder="Enter your name" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="text-secondary fw-bold">
                  Apellido:
                </Form.Label>
                <Form.Control type="text" placeholder="Ingresa tu apellido" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="text-secondary fw-bold">
                  Dirección:
                </Form.Label>
                <Form.Control type="text" placeholder="Ingresa tu dirección" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="text-secondary fw-bold">
                  Teléfono:
                </Form.Label>
                <Form.Control type="tel" placeholder="Ingresa tu teléfono" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="text-secondary fw-bold">Email:</Form.Label>
                <Form.Control type="email" placeholder="Ingresa tu email" />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="text-secondary fw-bold">
                  Contraseña:
                </Form.Label>
                <Form.Control type="password" placeholder="********************" />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="w-100 mb-3"
                style={{ fontWeight: "600", fontSize: "1rem" }}
              >
                Register
              </Button>
            </Form>
            <div className="text-center">
              <p className="text-secondary mb-2">Already have an account?</p>
              <Button
                variant="outline-primary"
                href="/login"
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

      <Footer/>
    </div>
  );
};

export default RecuperarContra;
