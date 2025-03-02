import React, { useContext } from "react";
import { Row, Col, Container } from "react-bootstrap";
import AuthContext from "../../context/AuthProvider";
import PerfilConductor from "./PerfilConductor";

const Perfil = () => {
  const { auth } = useContext(AuthContext);

  // Verificamos si auth está vacío o no tiene los datos necesarios
  if (!auth || Object.keys(auth).length === 0) {
    return (
      <Container fluid className="p-3">
        <div className="text-center">
          <h1 className="mb-4">Perfil del Usuario</h1>
          <hr className="my-4" />
          <p className="text-lg mb-4">Cargando datos del perfil...</p>
        </div>
      </Container>
    );
  }

  return (
    <>
      {"conductor" in auth ? (
        <PerfilConductor />
      ) : (
        <Container fluid className="p-3">
          <div className="text-center">
            <h1 className="mb-4">Perfil del Usuario</h1>
            <hr className="my-4" />
            <p className="text-lg mb-4">
              Este módulo te permite visualizar el perfil del Usuario
            </p>
          </div>

          <Row className="justify-content-center">
            {/* Información del Perfil */}
            <Col xs={12} md={8} lg={6}>
              <div
                className="p-4 border rounded shadow-lg bg-light"
                style={{ maxWidth: "600px", margin: "auto" }}
              >
                <h2
                  className="mb-4 text-center"
                  style={{ fontSize: "2.2rem", fontWeight: "bold" }}
                >
                  Información del Perfil
                </h2>
                {/* Asegúrate de que auth tiene los valores antes de renderizarlos */}
                <div style={{ fontSize: "2rem", lineHeight: "1.6" }}>
                  <p>
                    <strong>Nombre:</strong> {auth.nombre}
                  </p>
                  <p>
                    <strong>Apellido:</strong> {auth.apellido}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {auth.telefono}
                  </p>
                  <p>
                    <strong>Email:</strong> {auth.email}
                  </p>
                  <p>
                    <strong>Institución:</strong> {auth.institucion}
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default Perfil;
