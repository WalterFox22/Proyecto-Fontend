import React, { useContext, useState } from "react";
import { Row, Col, Container, Button, Modal, Form } from "react-bootstrap";
import AuthContext from "../../context/AuthProvider";
import PerfilConductor from "../../pages/driver/PerfilConductor";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import NoUser from'../../assets/NoUser.avif'

const Perfil = () => {
  const { auth } = useContext(AuthContext);
  console.log(auth);

  //Acciones para mostrar la pantalla emergente
  const [modalType, setModalType] = useState(null);
  const handleShowModal = (type) => setModalType(type);

  const handleCloseModal = () => {
    setModalType(null);
    // Restablecer el formulario del perfil si se cierra el modal sin guardar
  if (modalType === "perfil") {
    setFormPerfil({
      telefono: auth.conductor.telefono || "",
      placaAutomovil: auth.conductor.placaAutomovil || "",
      email: auth.conductor.email || "",
      foto: auth.conductor.foto || "",
      rutaAsignada: auth.conductor.rutaAsignada || "",
      sectoresRuta: auth.conductor.sectoresRuta || "",
    });
    setPreview(auth.conductor.foto || ""); // Restablecer el preview de la imagen
  }

  }

  // Accione para poder visualizar el password al ingresar
  const [showPasswordAnterior, setShowPasswordAnterior] = useState(false);
  const [showPasswordActual, setShowPasswordActual] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const { UpdatePassword, cargarPerfil } = useContext(AuthContext);
  const [mensaje, setMensaje] = useState({});

  

  //Logica para actualizar el Password
  const [form, setForm] = useState({
    passwordActual: "",
    passwordAnterior: "",
    passwordActualConfirm: "",
  });
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(form).includes("")) {
      setMensaje({
        respuesta: "Todos los campos deben ser ingresados",
        tipo: false,
      });
      toast.error("Todos los campos deben ser ingresados", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => {
        setMensaje({});
      }, 3000);
      return;
    }

    if (form.passwordActual.length < 6) {
      setMensaje({
        respuesta: "El password debe tener mínimo 6 carácteres",
        tipo: false,
      });
      toast.warning("El password debe tener mínimo 6 carácteres", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => {
        setMensaje({});
      }, 3000);
      return;
    }

    try {
      const resultado = await UpdatePassword(form);
      setMensaje(resultado);
      if (resultado.tipo) {
        toast.success("Contraseña actualizada correctamente", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        // Iterar sobre los errores del backend y mostrarlos con toast.error
        if (resultado.errors && Array.isArray(resultado.errors)) {
          resultado.errors.forEach((error) => {
            toast.error(error.msg, {
              position: "top-right",
              autoClose: 3000,
            });
          });
        } else {
          toast.error("Ocurrió un error inesperado", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      }
    } catch (error) {
      toast.error("Error al procesar la solicitud", {
        position: "top-right",
        autoClose: 3000,
      });
    }

    setTimeout(() => {
      setMensaje({});
    }, 3000);
  };

  // LOGICA PARA ACTUALIZAR PERFIL
  const [formPerfil, setFormPerfil] = useState({
    telefono: auth.telefono || "",
    placaAutomovil: auth.placaAutomovil || "",
    email: auth.email || "",
    foto: auth.foto || "", // Nueva propiedad
    rutaAsignada: auth.rutaAsignada || "",
    sectoresRuta: auth.sectoresRuta ||"", 
      
  });

  const [preview, setPreview] = useState(auth.foto || ""); // Preview de la imagen

  const handleChangePerfil = (e) => {
    setFormPerfil({
      ...formPerfil,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitPerfil = async (e) => {
    e.preventDefault();
    // Validar que todos los campos estén llenos
    if (Object.values(formPerfil).includes("") || !formPerfil.foto) {
      toast.error("Todos los campos deben ser llenados, incluida la foto", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("placaAutomovil", formPerfil.placaAutomovil);
    formData.append("telefono", formPerfil.telefono);
    formData.append("email", formPerfil.email);
    formData.append("rutaAsignada", formPerfil.rutaAsignada)
    formData.append("sectoresRuta",formPerfil.sectoresRuta)
    formData.append("fotografiaDelConductor", formPerfil.foto); // Agregar la imagen

    try {
      const token = localStorage.getItem("token");
      const url = `${
        import.meta.env.VITE_URL_BACKEND
      }/actualizar/informacion/admin`;
      const options = {
        headers: {
          "Content-Type": "multipart/form-data", // Importante para enviar archivos
          Authorization: `Bearer ${token}`, // Token del usuario
        },
      };

      const respuesta = await axios.patch(url, formData, options);
      cargarPerfil(token);
      if (respuesta.data.msg_actualizacion_perfil) {
        toast.success(respuesta.data.msg_actualizacion_perfil, {
          position: "top-right",
          autoClose: 3000,
        });
        handleCloseModal();
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.msg_actualizacion_perfil ||
          "Error al actualizar el perfil",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };

  // Manejar cambios en la imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // Muestra la imagen en el preview
        setFormPerfil({ ...formPerfil, foto: file }); // Guarda el archivo en el estado
      };
      reader.readAsDataURL(file);
    }
  };

  // Verificamos si auth está vacío o no tiene los datos necesarios
  if (!auth || Object.keys(auth).length === 0) {
    return (
      <Container fluid className="p-3">
        <div className="text-center">
          <h1 className="mb-4">Perfil del Administrador</h1>
          <hr className="my-4" />
          <p className="text-lg mb-4">Cargando datos del perfil...</p>
        </div>
      </Container>
    );
  }

  return (
    <>
      <ToastContainer />
      {auth.rol.includes("conductor") ? (
        <PerfilConductor />
      ) : (
        <Container fluid className="p-3">
          <div className="text-center">
            <h1 className="mb-4">Perfil del Administrador</h1>
            <hr className="my-4" />
            <p className="text-lg mb-4">
              Este módulo te permite visualizar el perfil del Administrador
            </p>
          </div>

          <Row className="justify-content-center">
            {/* Información del Perfil */}
            <Col xs={12} md={8} lg={6}>
              <div
                className="p-4 border rounded shadow-lg bg-light"
                style={{ maxWidth: "600px", margin: "auto" }}
              >
                <h2
                  className="mb-4 text-center"
                  style={{ fontSize: "2.2rem", fontWeight: "bold" }}
                >
                  Información del Perfil
                </h2>
                {/* Asegúrate de que auth tiene los valores antes de renderizarlos */}
                <div style={{ fontSize: "2rem", lineHeight: "1.6" }}>
                  <p>
                    <strong>Nombre:</strong> {auth.conductor.nombre}
                  </p>
                  <p>
                    <strong>Apellido:</strong> {auth.conductor.apellido}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {auth.conductor.telefono}
                  </p>
                  <p>
                    <strong>Email:</strong> {auth.conductor.email}
                  </p>
                  <p>
                    <strong>Institución:</strong> {auth.conductor.institucion}
                  </p>
                </div>
              </div>

              {/* Boton para actualizar  */}
              <div className="d-flex justify-content-center gap-2 mt-2">
                <Button
                  id="no-uppercase"
                  type="submit"
                  variant="success"
                  className="mx-auto d-block"
                  onClick={() => handleShowModal("perfil")}
                  style={{
                    width: "180px", // Ajusta según necesites
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                  marginTop: "10px",
                  padding: "0px 6px", // Ajustar relleno
                  }}
                >
                  Actualizar Perfil
                </Button>

                {/* Boton para actualizar el password */}
                <Button
                  id="no-uppercase"
                  type="submit"
                  variant="success"
                  className="mx-auto d-block"
                  onClick={() => handleShowModal("password")}
                  style={{
                    width: "180px", // Ajusta según necesites
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                  marginTop: "10px",
                  padding: "0px 6px", // Ajustar relleno
                  }}
                >
                  Actualizar Contraseña
                </Button>
              </div>
            </Col>
          </Row>

          {/* Modal Integrado ACTUALIZAR EL PERFIL */}

          <Modal
            show={modalType === "perfil"}
            onHide={handleCloseModal}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Actualizar Perfil</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmitPerfil}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Correo</Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    value={formPerfil.email}
                    onChange={handleChangePerfil}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="placaAutomovil">
                  <Form.Label>Placa del Vehiculo</Form.Label>
                  <Form.Control
                    type="text"
                    name="placaAutomovil"
                    value={formPerfil.placaAutomovil}
                    onChange={handleChangePerfil}
                    placeholder="Ingrese las placas. Ejemplo: PHT-8888 "
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="rutaAsignada">
                  <Form.Label>Ruta de Transporte</Form.Label>
                  <Form.Control
                    type="text"
                    name="rutaAsignada"
                    value={formPerfil.rutaAsignada}
                    onChange={handleChangePerfil}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="sectoresRuta">
                  <Form.Label>Sector designado</Form.Label>
                  <Form.Control
                    type="text"
                    name="sectoresRuta"
                    value={formPerfil.sectoresRuta}
                    onChange={handleChangePerfil}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="telefono">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    name="telefono"
                    value={formPerfil.telefono}
                    onChange={handleChangePerfil}
                  />
                </Form.Group>

                {/* Sección de foto de perfil */}
                <Form.Group className="mb-3">
                  <Form.Label>Foto de Perfil</Form.Label>
                  <div className="text-center mb-2">
                    <img
                      src={preview || NoUser}
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
                    onChange={handleImageChange}
                  />
                </Form.Group>

                <Modal.Footer>
                  <Button 
                  variant="success"
                  style={{ backgroundColor: "#FF3737", border: "none" }}
                  onClick={handleCloseModal}>
                    Cancelar
                  </Button>
                  <Button 
                  variant="success"
                  style={{ backgroundColor: "#4CAF50", border: "none" }} 
                  type="submit">
                    Guardar Cambios
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal.Body>
          </Modal>

          {/* Modal para Actualizar Password */}

          <Modal
            show={modalType === "password"}
            onHide={handleCloseModal}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Actualizar Contraseña</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* Asegúrate de que el formulario envuelve correctamente los elementos */}
              <Form onSubmit={handleSubmit}>
                {Object.keys(mensaje).length > 0 && (
                  <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
                )}

                <Form.Group className="mb-3" controlId="passwordAnterior">
                  <Form.Label>Antigua Contraseña</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPasswordAnterior ? "text" : "password"}
                      name="passwordAnterior"
                      placeholder="Ingrese su contraseña anterior"
                      value={form.passwordAnterior}
                      onChange={handleChange}
                      style={{ paddingRight: "2.5rem" }}
                    />
                    <span
                      onClick={() =>
                        setShowPasswordAnterior(!showPasswordAnterior)
                      }
                      className="position-absolute end-0 top-50 translate-middle-y me-2"
                      style={{ cursor: "pointer", color: "#555" }}
                    >
                      {showPasswordAnterior ? <FaEye /> : <FaEyeSlash />}
                    </span>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3" controlId="passwordActual">
                  <Form.Label>Nueva Contraseña</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPasswordActual ? "text" : "password"}
                      name="passwordActual"
                      placeholder="Ingrese su nueva contraseña"
                      value={form.passwordActual}
                      onChange={handleChange}
                      style={{ paddingRight: "2.5rem" }}
                    />
                    <span
                      onClick={() => setShowPasswordActual(!showPasswordActual)}
                      className="position-absolute end-0 top-50 translate-middle-y me-2"
                      style={{ cursor: "pointer", color: "#555" }}
                    >
                      {showPasswordActual ? <FaEye /> : <FaEyeSlash />}
                    </span>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3" controlId="passwordConfirm">
                  <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPasswordConfirm ? "text" : "password"}
                      name="passwordActualConfirm"
                      placeholder="Confirme su nueva contraseña"
                      value={form.passwordActualConfirm}
                      onChange={handleChange}
                      style={{ paddingRight: "2.5rem" }}
                    />
                    <span
                      onClick={() =>
                        setShowPasswordConfirm(!showPasswordConfirm)
                      }
                      className="position-absolute end-0 top-50 translate-middle-y me-2"
                      style={{ cursor: "pointer", color: "#555" }}
                    >
                      {showPasswordConfirm ? <FaEye /> : <FaEyeSlash />}
                    </span>
                  </div>
                </Form.Group>

                {/* Botones dentro del formulario */}
                <Modal.Footer>
                  <Button 
                  variant="success"
                  style={{ backgroundColor: "#FF3737", border: "none" }}
                  onClick={handleCloseModal}>
                    Cancelar
                  </Button>
                  <Button 
                  variant="success"
                  style={{ backgroundColor: "#4CAF50", border: "none" }} 
                  type="submit">
                    Guardar Cambios
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal.Body>
          </Modal>
        </Container>
      )}
    </>
  );
};

export default Perfil;