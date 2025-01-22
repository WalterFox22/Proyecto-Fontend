import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap';
import FormularioRegistro from "./FormularioRegistro";

const LoadingPhoto = () => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const handleClearImage = () => {
    setImage(null);
    setImageFile(null);
  };

  return (
    <Container fluid>
      <Row className="justify-content-center mt-5">
        <Col xs={12} md={6} className="text-center">
          <h3 className="mb-4">Subir la foto del Conductor</h3>
          <Form>
            <Form.Group>
              <Form.Label>Escoja una imagen</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="form-control-lg"
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
                type="button"
                variant="danger"
                onClick={handleClearImage}
                disabled={!image}
                style={{
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 20px",
                  transition: "background 0.3s ease",
                }}
              >
                Borrar
              </Button>
            </div>
          </Form>
          {image && (
            <div className="mt-4">
              <h5>Vista Previa:</h5>
              <Image src={image} alt="Uploaded Preview" fluid style={{ maxWidth: '200px', maxHeight: '200px' }} />
            </div>
          )}
        </Col>
        <Col xs={12} md={6}>
          <FormularioRegistro imageFile={imageFile} />
        </Col>
      </Row>
    </Container>
  );
};

export default LoadingPhoto;