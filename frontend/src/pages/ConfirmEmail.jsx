import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Container, Button, Spinner, Alert } from "react-bootstrap";

const ConfirmEmail = () => {
  const { token } = useParams();
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [tipo, setTipo] = useState("success");

  useEffect(() => {
    const confirmarEmail = async () => {
      try {
        const url = `${import.meta.env.VITE_URL_BACKEND}/cambio/email/${token}`;
        const { data } = await axios.get(url);
        setMensaje(data.msg);
        setTipo("success");
      } catch (error) {
        setMensaje(
          error.response?.data?.msg ||
            "Ocurrió un error al confirmar el correo electrónico"
        );
        setTipo("danger");
      } finally {
        setLoading(false);
      }
    };
    confirmarEmail();
  }, [token]);

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
      <h1 className="mb-4">Confirmación de Correo</h1>
      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <Alert variant={tipo} className="text-center" style={{ fontSize: "1.2rem" }}>
          {mensaje}
        </Alert>
      )}
      {!loading && tipo === "success" && (
        <Link to="/login">
          <Button variant="success" className="mt-3">
            Ir a Login
          </Button>
        </Link>
      )}
    </Container>
  );
};

export default ConfirmEmail;