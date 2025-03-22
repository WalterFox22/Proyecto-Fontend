import { Col, Container, Row } from "react-bootstrap";
import Loading from "../../componets/Loading/Loading";
import ListadeEstudiantes from "./Apartados-Driver/ListadeEstudiantes";
import { useContext } from "react";
import AuthContext from "../../context/AuthProvider";

const ListarEstudiantes = () => {
    const {auth}=useContext(AuthContext)
  return (
     <Container fluid className="p-3">
                {/* Encabezado */}
                <div className="text-center mb-4">
                    <h1>Lista de Estudiantes</h1>
                    <p>Este módulo te permite visualizar la lista de tus estudiantes.</p>
                </div>
    
                {/* Contenido principal */}
                <Row className="justify-content-center">
                    <Col xs={12}>  {/* Ahora la columna ocupa todo el ancho en todos los tamaños de pantalla */}
                        {/* BarraListar ocupa todo el ancho dentro de la columna */}
                        {auth ? (
                            <ListadeEstudiantes />
                        ) : (
                            <Loading />
                        )}
                    </Col>
                </Row>
            </Container>
        
  );
};

export default ListarEstudiantes;
