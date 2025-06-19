import { useContext, useState, useEffect } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import AuthContext from "../../context/AuthProvider";
import Mensaje from "../../componets/Alertas/Mensaje";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import NoUser from "../../assets/NoUser.avif";
import * as Yup from "yup";
import { useFormik } from "formik";

const onlyLetters = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
const telefonoRegex = /^\d{7,10}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const perfilSchema = Yup.object({
  telefono: Yup.string()
    .matches(telefonoRegex, "Teléfono inválido")
    .notRequired(),
  email: Yup.string()
    .matches(emailRegex, "Correo electrónico inválido")
    .notRequired(),
  fotografiaDelConductor: Yup.mixed()
    .test(
      "fileTypeOrUrl",
      "Solo se permiten imágenes JPG, JPEG o PNG",
      (value) => {
        if (!value) return true;
        if (typeof value === "string") return true; // Ya es una URL válida
        return (
          value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
        );
      }
    )
    .notRequired(),
});

const passwordSchema = Yup.object({
  passwordAnterior: Yup.string().required(
    "La contraseña anterior es obligatoria"
  ),
  passwordActual: Yup.string()
    .min(
      6,
      "La nueva contraseña debe tener mínimo 6 caracteres. Ejem: Abt234+*+"
    )
    .required("La nueva contraseña es obligatoria"),
  passwordActualConfirm: Yup.string()
    .oneOf([Yup.ref("passwordActual"), null], "Las contraseñas no coinciden")
    .required("Confirma la nueva contraseña"),
});

const PerfilConductor = () => {
  const { auth, UpdatePassword, cargarPerfil } = useContext(AuthContext);

  // Modal y preview
  const [modalType, setModalType] = useState(null);
  const handleShowModal = (type) => setModalType(type);
  const handleCloseModal = () => {
    setModalType(null);
    // Resetea el formulario de contraseña si el modal abierto era el de contraseña
    if (modalType === "password") {
      formikPassword.resetForm();
    }
  };

  const [preview, setPreview] = useState(auth.fotografiaDelConductor || "");

  // Resetear preview cada vez que se abre el modal de perfil
  useEffect(() => {
    if (modalType === "perfil") {
      setPreview(auth.fotografiaDelConductor || "");
    }
  }, [modalType, auth.fotografiaDelConductor]);

  // Formik para actualizar perfil
  const formikPerfil = useFormik({
    enableReinitialize: true,
    initialValues: {
      telefono: auth.telefono || "",
      email: auth.email || "",
      fotografiaDelConductor: auth.fotografiaDelConductor || "",
    },
    validationSchema: perfilSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      try {
        const token = localStorage.getItem("token");
        const url = `${
          import.meta.env.VITE_URL_BACKEND
        }/actualizar/perfil/conductor`;
        const options = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        };

        const respuesta = await axios.patch(url, formData, options);
        await cargarPerfil(token);
        if (respuesta.data.msg_actualizacion_perfil) {
          toast.success(respuesta.data.msg_actualizacion_perfil);
          handleCloseModal();
        }
      } catch (error) {
        toast.error(
          error.response?.data?.msg_actualizacion_perfil ||
            error.response?.data?.msg_registro_conductor ||
            "Error al actualizar el perfil",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }
    },
  });

  // Imagen para perfil
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      formikPerfil.setFieldValue("fotografiaDelConductor", file);
    }
  };

  // Contraseña (igual que tu lógica actual)
  const [showPasswordAnterior, setShowPasswordAnterior] = useState(false);
  const [showPasswordActual, setShowPasswordActual] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [mensaje, setMensaje] = useState({});
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
      if (resultado.msg_actualizacion_contrasenia) {
        const exito =
          resultado.msg_actualizacion_contrasenia.includes(
            "satisfactoriamente"
          );
        setMensaje({
          respuesta: resultado.msg_actualizacion_contrasenia,
          tipo: exito,
        });
        if (exito) {
          toast.success(resultado.msg_actualizacion_contrasenia, {
            position: "top-right",
            autoClose: 3000,
          });
          setTimeout(() => {
            setMensaje({});
            setForm({
              passwordActual: "",
              passwordAnterior: "",
              passwordActualConfirm: "",
            });
            handleCloseModal();
          }, 3000);
        } else {
          toast.error(resultado.msg_actualizacion_contrasenia, {
            position: "top-right",
            autoClose: 3000,
          });
          setTimeout(() => setMensaje({}), 3000);
        }
      } else if (resultado.msg) {
        setMensaje({
          respuesta: resultado.msg,
          tipo: false,
        });
        toast.error(resultado.msg, {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => setMensaje({}), 3000);
      } else {
        setMensaje({
          respuesta: "Ocurrió un error inesperado",
          tipo: false,
        });
        toast.error("Ocurrió un error inesperado", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => setMensaje({}), 3000);
      }
    } catch (error) {
      toast.error("Error al procesar la solicitud", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => setMensaje({}), 3000);
    }

    setTimeout(() => {
      setMensaje({});
    }, 3000);
  };

  // Formik para actualizar contraseña
  const formikPassword = useFormik({
    initialValues: {
      passwordAnterior: "",
      passwordActual: "",
      passwordActualConfirm: "",
    },
    validationSchema: passwordSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const resultado = await UpdatePassword(values);
        if (resultado.msg_actualizacion_contrasenia) {
          toast.success(resultado.msg_actualizacion_contrasenia);
          resetForm();
          handleCloseModal();
        } else if (resultado.msg) {
          toast.error(resultado.msg);
        } else {
          toast.error("Ocurrió un error inesperado");
        }
      } catch (error) {
        toast.error("Error al procesar la solicitud");
      }
    },
  });

  if (!auth || Object.keys(auth).length === 0) {
    return (
      <Container fluid className="p-3">
        <div className="text-center">
          <h1 className="mb-4">Perfil del Conductor</h1>
          <hr className="my-4" />
          <p className="text-lg mb-4">Cargando datos del perfil...</p>
        </div>
      </Container>
    );
  }
  return (
    <>
      <style>
        {`
          .form-control.is-invalid, .was-validated .form-control:invalid {
            background-image: none !important;
          }
        `}
      </style>
      <Container fluid className="p-3">
        <ToastContainer />
        <div className="text-center">
          <h1 className="mb-4">Perfil del Conductor</h1>
          <hr className="my-4" />
          <p className="text-lg mb-4">
            Este módulo te permite visualizar el perfil Conductor
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
                style={{
                  fontSize: "2.2rem",
                  fontWeight: "bold",
                }}
              >
                Información del Perfil
              </h2>
              <div style={{ fontSize: "2rem", lineHeight: "1.6" }}>
                <p>
                  <strong>Nombre del Conductor:</strong> {auth?.nombre}
                </p>
                <p>
                  <strong>Apellido:</strong> {auth.apellido}
                </p>
                <p>
                  <strong>Teléfono:</strong> {auth.telefono}
                </p>
                <p>
                  <strong>Cédula:</strong> {auth.cedula}
                </p>
                <p>
                  <strong>Email:</strong> {auth.email}
                </p>
                <p>
                  <strong>Cooperativa:</strong> {auth.cooperativa}
                </p>
                <p>
                  <strong>Placa del Automóvil:</strong> {auth.placaAutomovil}
                </p>
                <p>
                  <strong>Sector de su ruta:</strong> {auth.sectoresRuta}
                </p>
                <p>
                  <strong>Ruta de transporte:</strong> {auth.rutaAsignada}
                </p>
                <p>
                  <strong>N° de estudiantes a cargo:</strong>{" "}
                  {auth.numeroEstudiantes}
                </p>
                <p>
                  <strong>Institución:</strong> {auth.institucion}
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
                  width: "180px",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  marginTop: "10px",
                  padding: "0px 6px",
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
                  width: "180px",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  marginTop: "10px",
                  padding: "0px 6px",
                }}
              >
                Actualizar Contraseña
              </Button>
            </div>
          </Col>
        </Row>

        {/* Modal Integrado ACTUALIZAR EL PERFIL */}
        <Modal show={modalType === "perfil"} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Actualizar Perfil</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={formikPerfil.handleSubmit}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  value={formikPerfil.values.email}
                  onChange={formikPerfil.handleChange}
                  onBlur={formikPerfil.handleBlur}
                  isInvalid={
                    !!formikPerfil.errors.email && formikPerfil.touched.email
                  }
                />
                <Form.Control.Feedback
                  type="invalid"
                  style={{ color: "#e74c3c" }}
                >
                  {formikPerfil.errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="telefono">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  value={formikPerfil.values.telefono}
                  onChange={formikPerfil.handleChange}
                  onBlur={formikPerfil.handleBlur}
                  isInvalid={
                    !!formikPerfil.errors.telefono &&
                    formikPerfil.touched.telefono
                  }
                />
                <Form.Control.Feedback
                  type="invalid"
                  style={{ color: "#e74c3c" }}
                >
                  {formikPerfil.errors.telefono}
                </Form.Control.Feedback>
              </Form.Group>
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
                {formikPerfil.errors.fotografiaDelConductor && (
                  <div style={{ color: "#e74c3c", fontSize: "0.95em" }}>
                    {formikPerfil.errors.fotografiaDelConductor}
                  </div>
                )}
              </Form.Group>
              <Modal.Footer>
                <Button
                  variant="success"
                  style={{
                    backgroundColor: "#FF3737",
                    border: "none",
                  }}
                  onClick={handleCloseModal}
                >
                  Cancelar
                </Button>
                <Button
                  variant="success"
                  style={{
                    backgroundColor: "#4CAF50",
                    border: "none",
                  }}
                  type="submit"
                >
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
            <Form onSubmit={formikPassword.handleSubmit}>
              <Form.Group className="mb-3" controlId="passwordAnterior">
                <Form.Label>Antigua Contraseña</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPasswordAnterior ? "text" : "password"}
                    name="passwordAnterior"
                    placeholder="Ingrese su contraseña anterior"
                    value={formikPassword.values.passwordAnterior}
                    onChange={formikPassword.handleChange}
                    onBlur={formikPassword.handleBlur}
                    style={{ paddingRight: "2.5rem" }}
                    isInvalid={
                      !!formikPassword.errors.passwordAnterior &&
                      formikPassword.touched.passwordAnterior
                    }
                  />
                  <span
                    onClick={() =>
                      setShowPasswordAnterior(!showPasswordAnterior)
                    }
                    className="position-absolute end-0 top-50 translate-middle-y me-2"
                    style={{
                      cursor: "pointer",
                      color: "#555",
                    }}
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
                    value={formikPassword.values.passwordActual}
                    onChange={formikPassword.handleChange}
                    onBlur={formikPassword.handleBlur}
                    style={{ paddingRight: "2.5rem" }}
                    isInvalid={
                      !!formikPassword.errors.passwordActual &&
                      formikPassword.touched.passwordActual
                    }
                  />
                  <span
                    onClick={() => setShowPasswordActual(!showPasswordActual)}
                    className="position-absolute end-0 top-50 translate-middle-y me-2"
                    style={{
                      cursor: "pointer",
                      color: "#555",
                    }}
                  >
                    {showPasswordActual ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="passwordConfirm">
                <Form.Label>Confirmar nueva Contraseña</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPasswordConfirm ? "text" : "password"}
                    name="passwordActualConfirm"
                    placeholder="Confirme su nueva contraseña"
                    value={formikPassword.values.passwordActualConfirm}
                    onChange={formikPassword.handleChange}
                    onBlur={formikPassword.handleBlur}
                    style={{ paddingRight: "2.5rem" }}
                    isInvalid={
                      !!formikPassword.errors.passwordActualConfirm &&
                      formikPassword.touched.passwordActualConfirm
                    }
                  />
                  <span
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="position-absolute end-0 top-50 translate-middle-y me-2"
                    style={{
                      cursor: "pointer",
                      color: "#555",
                    }}
                  >
                    {showPasswordConfirm ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
              </Form.Group>
              <Modal.Footer>
                <Button
                  variant="success"
                  style={{
                    backgroundColor: "#FF3737",
                    border: "none",
                  }}
                  onClick={handleCloseModal}
                >
                  Cancelar
                </Button>
                <Button
                  variant="success"
                  style={{
                    backgroundColor: "#4CAF50",
                    border: "none",
                  }}
                  type="submit"
                >
                  Guardar Cambios
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default PerfilConductor;
