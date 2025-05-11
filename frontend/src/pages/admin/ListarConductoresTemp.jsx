import { useContext } from "react";
import AuthContext from "../../context/AuthProvider";
import { Col, Container, Row } from "react-bootstrap";
import BarraListaTemp from "./Extras/BarraListaTemp";

const ListarCondutorTemp = () => {
  const { auth } = useContext(AuthContext);

  return (
    <Container fluid className="p-3">
      {/* Encabezado */}
      <div className="text-center mb-4">
        <h1>Lista de Conductores Temporales</h1>
        <h5>Unidad Educativa Particular Emaús</h5>
        <hr />
        <p>Este módulo te permite visualizar la lista de conductores Temporales.</p>
      </div>

      {/* Contenido principal */}
      <Row className="justify-content-center">
        <Col xs={12}>
          {auth.rol.includes("admin") ?(
            <BarraListaTemp />
          ): (
            <Loading />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ListarCondutorTemp;
