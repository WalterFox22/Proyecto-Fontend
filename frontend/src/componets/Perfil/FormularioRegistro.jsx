import React, { useState } from "react";
import { Container, Form, Button, ProgressBar } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import NoUser from "../../assets/NoUser.avif";

const FormularioRegistro = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    cedula: "",
    email: "",
    institucion: "Unidad Educativa Particular Emaús",
    generoConductor: "",
    placaAutomovil: "",
    cooperativa: "",
    esReemplazo: "",
    rutaAsignada: "",
    sectoresRuta: "",
  });
  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Solo se permiten archivos de imagen en formato JPG, JPEG o PNG");
        setImagen(null);
        setImagenPreview(null);
        return;
      }
      setImagen(file);
      setImagenPreview(URL.createObjectURL(file));
    } else {
      setImagen(null);
      setImagenPreview(null);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleNextStep2 = () => {
    if (!imagen) {
      toast.error("Debes subir una imagen");
      return;
    }
    nextStep();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación manual
    if (
      !form.nombre ||
      !form.apellido ||
      !form.telefono ||
      !form.cedula ||
      !form.email ||
      !form.generoConductor ||
      !form.placaAutomovil ||
      !form.cooperativa ||
      !form.esReemplazo ||
      (form.esReemplazo === "No" && (!form.rutaAsignada || !form.sectoresRuta)) ||
      !imagen
    ) {
      toast.error("Todos los campos son obligatorios, incluida la foto");
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(form).forEach((key) => {
      // Si es reemplazo, ruta y sector deben ir vacíos
      if (
        form.esReemplazo === "Sí" &&
        (key === "rutaAsignada" || key === "sectoresRuta")
      ) {
        formDataToSend.append(key, "");
      } else {
        formDataToSend.append(key, form[key]);
      }
    });
    formDataToSend.append("fotografiaDelConductor", imagen);

    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_URL_BACKEND}/registro/conductores`;
      const options = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(url, formDataToSend, options);

      if (response) {
        toast.success("Conductor registrado con éxito y correo enviado");
        setForm({
          nombre: "",
          apellido: "",
          telefono: "",
          cedula: "",
          email: "",
          institucion: "Unidad Educativa Particular Emaús",
          generoConductor: "",
          placaAutomovil: "",
          cooperativa: "",
          esReemplazo: "",
          rutaAsignada: "",
          sectoresRuta: "",
        });
        setImagen(null);
        setImagenPreview(null);
        setStep(1);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const backendResponse = error.response.data;
        if (backendResponse.errors && Array.isArray(backendResponse.errors)) {
          backendResponse.errors.forEach((err) => {
            toast.error(err.msg || err);
          });
        } else if (backendResponse.msg_registro_conductor) {
          toast.error(backendResponse.msg_registro_conductor);
        } else if (backendResponse.msg_registro_representante) {
          toast.error(backendResponse.msg_registro_representante);
        } else if (backendResponse.msg) {
          toast.error(backendResponse.msg);
        } else {
          toast.error("Error desconocido. Por favor, verifica los datos e intenta nuevamente.");
        }
      } else {
        toast.error("Error de red. Por favor, intenta nuevamente.");
      }
    }
  };

  const progress = (step / 3) * 100;

  return (
    <>
      <ToastContainer />
      <Container className="mt-4">
        <ProgressBar variant="success" now={progress} className="mb-4" />
        <Form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "bold" }}>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ingrese el Nombre"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "bold" }}>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  placeholder="Ingrese el Apellido"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "bold" }}>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="Ingrese el teléfono"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "bold" }}>Cédula</Form.Label>
                <Form.Control
                  type="text"
                  name="cedula"
                  value={form.cedula}
                  onChange={handleChange}
                  placeholder="Ingrese su cédula (solo 10 dígitos)"
                  required
                />
              </Form.Group>
              <Button
                variant="success"
                className="mt-1"
                style={{ backgroundColor: "#32CD32", border: "none" }}
                onClick={nextStep}
              >
                Siguiente
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "bold" }}>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Ingrese el correo electrónico"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "bold" }}>Institución</Form.Label>
                <Form.Control
                  type="text"
                  name="institucion"
                  value={form.institucion}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "bold" }}>Género</Form.Label>
                <Form.Select
                  name="generoConductor"
                  value={form.generoConductor}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un género</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "bold" }}>Foto del Conductor</Form.Label>
                <div className="text-center mb-2">
                  <img
                    src={imagenPreview || NoUser}
                    alt="Foto de perfil"
                    className="img-thumbnail rounded-circle"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </Form.Group>
              <Button
                variant="success"
                style={{ backgroundColor: "#333333", border: "none" }}
                onClick={prevStep}
                className="me-2 mt-1"
              >
                Atrás
              </Button>
              <Button
                variant="success"
                style={{ backgroundColor: "#32CD32", border: "none" }}
                onClick={handleNextStep2}
                className="mt-1"
              >
                Siguiente
              </Button>
            </>
          )}

          {step === 3 && (
            <>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "bold" }}>Placa del Automóvil</Form.Label>
                <Form.Control
                  type="text"
                  name="placaAutomovil"
                  value={form.placaAutomovil}
                  onChange={handleChange}
                  placeholder="Ingrese las placas. Ejemplo: PHT-8888 "
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "bold" }}>Cooperativa</Form.Label>
                <Form.Control
                  type="text"
                  name="cooperativa"
                  value={form.cooperativa}
                  onChange={handleChange}
                  placeholder="Ingrese la cooperativa"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "bold" }}>
                  ¿El conductor registrado es o no un conductor reemplazo?
                </Form.Label>
                <Form.Select
                  name="esReemplazo"
                  value={form.esReemplazo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una opción</option>
                  <option value="Sí">Sí es conductor remplazo</option>
                  <option value="No">No es conductor remplazo</option>
                </Form.Select>
              </Form.Group>
              {form.esReemplazo === "No" && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "bold" }}>Ruta Asignada</Form.Label>
                    <Form.Control
                      type="text"
                      name="rutaAsignada"
                      value={form.rutaAsignada}
                      onChange={handleChange}
                      placeholder="Ingrese la ruta (Ejm: 11)"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "bold" }}>Sectores de la Ruta</Form.Label>
                    <Form.Control
                      type="text"
                      name="sectoresRuta"
                      value={form.sectoresRuta}
                      onChange={handleChange}
                      placeholder="Ingrese el sector (Ejm: La Mariscal)"
                      required
                    />
                  </Form.Group>
                </>
              )}
              <Button
                variant="success"
                style={{ backgroundColor: "#333333", border: "none" }}
                onClick={prevStep}
                className="me-2 mt-1"
              >
                Atrás
              </Button>
              <Button
                type="submit"
                variant="success"
                style={{ backgroundColor: "#32CD32", border: "none" }}
                className="mt-1"
              >
                Registrar
              </Button>
            </>
          )}
        </Form>
      </Container>
    </>
  );
};

export default FormularioRegistro;