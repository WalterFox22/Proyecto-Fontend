import { Col, Container, Row } from "react-bootstrap";
import FormularioEstudiante from "./Apartados-Driver/FormularioEstudiantes";

const RegistroEstudinates = () => {
  return (
    <Container fluid className="p-3">
      {/* Encabezado */}
      <div className="text-center mb-0">
        <h1>Registro de Estudiantes</h1>
        <hr />
        <p className="mb-1"> {/* Agregado mb-3 para ajustar el espacio */}
          Este módulo te permite registrar un nuevo estudiante.</p>
      </div>

      {/* Contenido principal */}
      <Row className="justify-content-center align-items-center mt-0">
        <Col xs={12} sm={10} md={8} lg={6}>
          <FormularioEstudiante />
        </Col>
      </Row>
    </Container>
  );
};
export default RegistroEstudinates;
