import { Col, Container, Row } from "react-bootstrap";
import FormularioRegistroAdmin from "../../componets/Perfil/FormularioRegistroAdmin";

const RegistrarAdmin = () => {
  return (
    <Container fluid className="p-3">
      {/* Encabezado */}
      <div className="text-center mb-4">
        <h1>Registro nuevo administrador</h1>
        <hr />
        <p>Este módulo te permite registrar un nuevo administrador</p>
      </div>

      {/* Contenido principal */}
      <Row className="justify-content-center align-items-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <FormularioRegistroAdmin/>
        </Col>
      </Row>
    </Container>
  );
};

export default RegistrarAdmin;
