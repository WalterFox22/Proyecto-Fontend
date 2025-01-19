import React, { useContext } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Container, Row, Col, Navbar, Nav, Image, Button } from 'react-bootstrap';
import AuthContext from '../context/AuthProvider';
import Footer from '../pages/Footer'
import LogoAdmin from '../assets/Admin.png'

const Dashboard = () => {
  const location = useLocation();
  const urlActual = location.pathname;

  const { auth } = useContext(AuthContext);
  const autenticado = localStorage.getItem('token');

  return (
    <>
        <Container fluid className="p-0 vh-100 d-flex flex-column">
        <Row className="flex-nowrap flex-grow-1 m-0">
            {/* Sidebar */}
            <Col
            md={3}
            lg={2}
            className="bg-dark text-light p-3 d-flex flex-column"
            style={{ height: '100vh', overflowY: 'auto' }}
            >
            <h2 className="text-center fw-bold">U.E EMAUS</h2>
            <div className="text-center my-4">
                <Image
                src={LogoAdmin}
                roundedCircle
                width={120}
                height={120}
                className="border border-secondary"
                />
                <p className="mt-3">
                    <span className="bg-success rounded-circle d-inline-block me-2" style={{ width: 10, height: 10 }}></span>
                    Bienvenido - {auth?.nombre || 'Usuario desconocido'}
                </p>
            </div>
            <hr />
            <Nav className="flex-column">
                <Nav.Link
                as={Link}
                to="/dashboard"
                className={urlActual === '/dashboard' ? 'active text-light bg-secondary rounded p-2' : 'text-light'}
                >
                Perfil Administrador
                </Nav.Link>
                <Nav.Link
                as={Link}
                to="/dashboard/registro/conductores"
                className={urlActual === '/dashboard/registro/conductores' ? 'active text-light bg-secondary rounded p-2' : 'text-light'}
                >
                Registrar Conductor
                </Nav.Link>
                <Nav.Link
                as={Link}
                to="/dashboard/listar/conductores"
                className={urlActual === '/dashboard/listar/conductores' ? 'active text-light bg-secondary rounded p-2' : 'text-light'}
                >
                Lista de Conductores
                </Nav.Link>
            </Nav>
            </Col>

            {/* Main Content */}
            <Col className="d-flex flex-column p-0">
            {/* Top Navbar */}
            <Navbar bg="dark" variant="dark" className="justify-content-end px-3">
                <Navbar.Text className="me-3">Usuario - {auth?.nombre}</Navbar.Text>
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
                to="/"
                onClick={() => localStorage.removeItem('token')}
                >
                Salir
                </Button>
            </Navbar>

            {/* Dynamic Content */}
            <div
                className="flex-grow-1 p-4 bg-light"
                style={{ height: 'calc(100vh - 56px)', overflow: 'auto' }}
            >
                {autenticado ? <Outlet /> : <Navigate to="/login" />}
            </div>
            </Col>
        </Row>
        <Footer/>
        </Container>
        
    </>
  );
};

export default Dashboard;
