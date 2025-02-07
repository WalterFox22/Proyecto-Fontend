import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="text-white text-center py-3" style={{backgroundColor: '#560C23'}}>
      <Container fluid>
      <p className="mb-0 text-white">© {new Date().getFullYear()} Todos los derechos Reservados. U.E EMAUS.</p>
      </Container>
    </footer>
  );
};

export default Footer;