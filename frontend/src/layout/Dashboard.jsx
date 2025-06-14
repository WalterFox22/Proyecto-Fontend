import React, { useContext, useEffect, useState } from "react";
import {Link,Navigate,Outlet,useLocation,useNavigate,} from "react-router-dom";
import {Container,Row,Col,Navbar,Nav,Image,Button,} from "react-bootstrap";
import AuthContext from "../context/AuthProvider";
import LogoAdmin from "../assets/Admin.png";
import Loading from "../componets/Loading/Loading";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

const Dashboard = () => {
  {
    /** */
  }
  const location = useLocation();
  const urlActual = location.pathname;

  const { auth, loading, setAuth } = useContext(AuthContext);
  const autenticado = localStorage.getItem("token");

  useEffect(() => {
    if (!loading) {
      // Se puede hacer alguna lógica aquí si es necesario cuando la carga termina.
    }
  }, [loading]);

  if (loading) {
    return <Loading />;
  }

  // Verificamos si el usuario no está autenticado y lo redirigimos a login
  if (!autenticado) {
    return <Navigate to="/login" />;
  }

  // LOGICA PARA HACER CONDUCTOR AL ADMIN
  const handleMakeDriver = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_URL_BACKEND}/aumentar/privilegios/conductor`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const respuesta = await axios.patch(url, {}, options);
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text:
          respuesta.data.msg_añadir_privilegios ||
          "Ya posee usted privilegios de conductor",
      });
      // Actualiza el estado local para ocultar el botón
      setAuth({ ...auth, esConductor: "Si" });
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.msg_ceder_privilegios
      ) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.msg_ceder_privilegios,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al intentar aumentar privilegios.",
        });
      }
      console.log(error);
    }
  };

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
            backgroundColor: "#560C23",
            minHeight: "100vh",
            maxWidth: "250px",
            width: "100%",
            overflowY: "auto",
          }}
        >
          <h2 className="text-center fw-bold">U.E EMAUS</h2>
          <div className="text-center my-4">
            <Image
              src={auth.fotografiaDelConductor}
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
              Bienvenido - {auth?.nombre || "Usuario desconocido"}
            </p>
            <p
              className="text-slate-400 text-center text-sm"
              style={{ color: "white", marginBottom: "0.5rem" }}
            >
              {" "}
              Rol - {auth?.rol}
            </p>
          </div>
          {auth.esConductor === "No" && (
            <div
              className="d-flex justify-content-center mb-2"
              style={{ marginTop: "-0.5rem" }}
            >
              <Button
                size="sm"
                style={{
                  backgroundColor: "#F5E6E8",
                  color: "#560C23",
                  border: "none",
                  minWidth: "110px",
                  fontWeight: "bold",
                }}
                onClick={handleMakeDriver}
              >
                Ser Conductor
              </Button>
            </div>
          )}
          <hr />
          <Nav className="flex-column">
            <Nav.Link
              as={Link}
              to="/dashboard"
              className={
                urlActual === "/dashboard"
                  ? "active text-light bg-secondary rounded p-2"
                  : "text-light"
              }
            >
              Perfil del Usuario
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/dashboard/registro/conductores"
              className={
                urlActual === "/dashboard/registro/conductores"
                  ? "active text-light bg-secondary rounded p-2"
                  : "text-light"
              }
            >
              Registrar Conductor
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/dashboard/listar/conductores"
              className={
                urlActual === "/dashboard/listar/conductores"
                  ? "active text-light bg-secondary rounded p-2"
                  : "text-light"
              }
            >
              Lista de Conductores
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/dashboard/listar/conductores/temporales"
              className={
                urlActual === "/dashboard/listar/conductores/temporales"
                  ? "active text-light bg-secondary rounded p-2"
                  : "text-light"
              }
            >
              Conductores Temporales
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/dashboard/registro/nuevo/admin"
              className={
                urlActual === "/dashboard/registro/nuevo/admin"
                  ? "active text-light bg-secondary rounded p-2"
                  : "text-light"
              }
            >
              Registrar Administrador
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/dashboard/reportes-generales"
              className={
                urlActual === "/dashboard/reportes-generales"
                  ? "active text-light bg-secondary rounded p-2"
                  : "text-light"
              }
            >
              Reportes
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
              Usuario - {auth?.nombre}
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
              onClick={() => localStorage.removeItem("token")}
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

export default Dashboard;
