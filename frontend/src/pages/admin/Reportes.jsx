import { Col, Container, Row } from "react-bootstrap";
import ListaReportes from "./Extras/ListaReportes";

const Reportes = () => {
  return (
    <Container fluid className="p-3">
      {/* Encabezado */}
      <div className="text-center mb-4">
        <h1>Reportes del sistema</h1>
        <hr />
      </div>

      {/* Contenido principal */}
      <Row className="justify-content-center align-items-center">
        <Col xs={12}>
          <ListaReportes/>
        </Col>
      </Row>
    </Container>
  );
};

export default Reportes