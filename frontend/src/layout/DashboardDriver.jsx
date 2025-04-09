import React, { useContext, useEffect, useState } from "react";
import {Link,Navigate,Outlet,useLocation,useNavigate,} from "react-router-dom";
import {Container,Row,Col,Navbar,Nav,Image,Button,} from "react-bootstrap";
import AuthContext from "../context/AuthProvider";
import LogoAdmin from "../assets/Admin.png";
import Loading from "../componets/Loading/Loading";

const DashboardDriver = () => {
  const location = useLocation();
  const urlActual = location.pathname;
  const navigate = useNavigate();

  const { auth, loading } = useContext(AuthContext);
  const autenticado = localStorage.getItem("token");
  const [error, setError] = useState(null);

  // redireccion al ultimo URL que estuvo tras dar F5
  useEffect(() => {
    if (autenticado && location.pathname !== "/login") {
      localStorage.setItem("lastVisitedPath", location.pathname);
    }
  }, [autenticado, location.pathname]);

  {/** 
  useEffect(() => {
    console.log("Loading:", loading);
    console.log("Authenticated:", autenticado);
    console.log("Auth:", auth);
    console.log("Rol:", auth.rol);
    if (!loading && !autenticado) {
      setError("No se pudo autenticar. Por favor, inicie sesión nuevamente.");
      navigate("/login");
    }
  }, [loading, autenticado, auth]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  

  if (!autenticado) {
    return <Navigate to="/login" />;
  }
    */}

  return (
    <Container
      fluid
      className="p-0 d-flex flex-column"
      style={{ minHeight: "100vh" }}
    >
      <Row className="flex-nowrap flex-grow-1 m-0" style={{ flex: 1 }}>
        {/* Sidebar */}
        <Col
          xs={12}
          md={3}
          lg={2}
          className="text-light p-3 d-flex flex-column"
          style={{
            backgroundColor: "#008080",
            minHeight: "100vh",
            maxWidth: "250px",
            width: "100%",
            overflowY: "auto",
          }}
        >
          <h2 className="text-center fw-bold">U.E EMAUS</h2>
          <div className="text-center my-4">
            <Image
              src={auth?.fotografiaDelConductor || auth?.conductor.fotografiaDelConductor}
              className="img-fluid border border-secondary"
              style={{
                width: "160px", // Asegura que el ancho sea fijo
                height: "160px", // Asegura que la altura sea igual al ancho
                objectFit: "cover", // Recorta la imagen para que se ajuste al contenedor
                borderRadius: "50%", // Hace que la imagen sea perfectamente redonda
              }}
            />
            <p className="mt-3" style={{ color: "white" }}>
              <span
                className="bg-success rounded-circle d-inline-block me-2"
                style={{ width: 10, height: 10 }}
              ></span>
              Bienvenido - {auth?.nombre ||auth?.conductor.nombre || "Usuario desconocido"}
            </p>
            <p
              className="text-slate-400 text-center my-4 text-sm"
              style={{ color: "white" }}
            >
              {" "}
              Rol - {auth?.rol ||auth?.conductor.rol}
            </p>
          </div>
          <hr />
          <Nav className="flex-column">
            <Nav.Link
              as={Link}
              to="/dashboardConductor"
              className={
                urlActual === "/dashboardConductor"
                  ? "active text-light bg-secondary rounded p-2"
                  : "text-light"
              }
            >
              Perfil del Usuario
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/dashboardConductor/registrar-estudiantes"
              className={
                urlActual === "/dashboardConductor/registrar-estudiantes"
                  ? "active text-light bg-secondary rounded p-2"
                  : "text-light"
              }
            >
              Registrar Estudiantes
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/dashboardConductor/lista-estudiantes"
              className={
                urlActual === "/dashboardConductor/lista-estudiantes"
                  ? "active text-light bg-secondary rounded p-2"
                  : "text-light"
              }
            >
              Lista de Estudiantes
            </Nav.Link>
          </Nav>
        </Col>

        {/* Main Content */}
        <Col
          className="d-flex flex-column p-0"
          style={{ minHeight: "100vh", flexGrow: 1 }}
        >
          {/* Top Navbar */}
          <Navbar
            className="justify-content-end px-3"
            style={{ backgroundColor: "#F8F9FA" }}
          >
            <Navbar.Text
              className="me-3"
              style={{ color: "black", fontSize: "18px" }}
            >
              Usuario - {auth?.nombre || auth?.conductor.nombre}
            </Navbar.Text>
            <Image
              src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png"
              roundedCircle
              width={40}
              height={40}
              className="border border-success me-3"
            />
            <Button
              variant="danger"
              as={Link}
              to="/login"
              onClick={() => {
                localStorage.removeItem("token") 
                localStorage.removeItem("lastVisitedPath");
              } }
              
            >
              Salir
            </Button>
          </Navbar>

          {/* Dynamic Content */}
          <div
            className="flex-grow-1 p-4 bg-light"
            style={{ minHeight: "calc(100vh - 56px)", overflow: "auto" }}
          >
            {autenticado ? <Outlet /> : <Navigate to="/login" />}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardDriver;