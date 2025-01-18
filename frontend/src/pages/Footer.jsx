// Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#343a40",
        color: "#fff",
        textAlign: "center",
        padding: "1rem",
        fontSize: "0.9rem",
        position: "relative", // Se queda al final de la página sin ser flotante
        bottom: 0, // Asegura que esté al final del contenedor
        width: "100%", // Asegura que ocupe todo el ancho
      }}
    >
      <p style={{ margin: 0 }}>© 2025 Todos los derechos Reservados. U.E EMAUS.</p>
    </footer>
  );
};

export default Footer;
