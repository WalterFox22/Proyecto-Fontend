import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap'

const LoadingPhoto = () => {
  const [image, setImage] = useState(null) //inicializarmos el espacio de almacenamiento en vacio o sea null

  // Función para manejar la carga de la imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  };

  // Función para borrar la imagen cargada
  const handleClearImage = () => {
    setImage(null); // Resetea el estado de la imagen a null
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs={12} md={6} className="text-center">
          <h3 className="mb-4">Subir la foto del Conductor</h3>
          <Form>
            <Form.Group>
              <Form.Label>Eescoja una imagen</Form.Label>
              {/* Ajuste para hacer el input más ancho */}
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="form-control-lg"  // para agrandar la caja del input
                style={{
                  padding: '20px',          
                  fontSize: '16px',           
                  border: '2px solid #ddd',  
                  borderRadius: '8px',      
                  width: '100%',          
                  maxWidth: '500px',      
                }}
              />
            </Form.Group>
            <div className="mt-3">
            <Button
            type="submit"
            variant="success"
            className="me-2"
            disabled={!image}
            style={{
                border: "none", // Sin borde
                borderRadius: "5px", // Bordes redondeados
                padding: "10px 20px", // Espaciado dentro del botón
               
            }}
            >
            Subir
            </Button>

              {/* Botón para borrar la imagen */}
              <Button
                variant="danger"
                onClick={handleClearImage}
                disabled={!image} // Deshabilita el botón si no hay imagen seleccionada
                style={{
                    border: "none", // Sin borde
                    borderRadius: "5px", // Bordes redondeados
                    padding: "10px 20px", // Espaciado dentro del botón
                    transition: "background 0.3s ease", // Transición suave para el fondo
                }}
            >
                Borrar
            </Button>
            </div>
          </Form>

          {/* Mostrar la imagen cargada si existe */}
          {image && (
            <div className="mt-4">
              <h5>Vista Previa:</h5>
              <Image src={image} alt="Uploaded Preview" fluid />
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default LoadingPhoto;
