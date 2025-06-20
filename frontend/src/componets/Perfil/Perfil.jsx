import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Container, Button, Modal, Form } from "react-bootstrap";
import AuthContext from "../../context/AuthProvider";
import PerfilConductor from "../../pages/driver/PerfilConductor";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import NoUser from "../../assets/NoUser.avif";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Mensaje from "../Alertas/Mensaje";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useRef } from "react";

const onlyLetters = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
const placaRegex = /^[A-Z]{3}-\d{4}$/;

const passwordSchema = Yup.object({
  passwordAnterior: Yup.string().required(
    "La contraseña anterior es obligatoria"
  ),
  passwordActual: Yup.string()
    .min(6, "La nueva contraseña debe tener mínimo 6 caracteres")
    .required("La nueva contraseña es obligatoria"),
  passwordActualConfirm: Yup.string()
    .oneOf([Yup.ref("passwordActual"), null], "Las contraseñas no coinciden")
    .required("Confirma la nueva contraseña"),
});

const perfilSchema = Yup.object({
  nombre: Yup.string()
    .matches(onlyLetters, "Solo se permiten letras")
    .notRequired(),
  apellido: Yup.string()
    .matches(onlyLetters, "Solo se permiten letras")
    .notRequired(),
  email: Yup.string().email("Correo electrónico inválido").notRequired(),
  cedula: Yup.string()
    .matches(/^\d{10}$/, "La cédula debe tener 10 dígitos")
    .notRequired(),
  cooperativa: Yup.string()
    .matches(onlyLetters, "Solo se permiten letras")
    .notRequired(),
  placaAutomovil: Yup.string()
    .matches(placaRegex, "Formato de placa inválido. Ejemplo: PRT-9888")
    .notRequired(),
  telefono: Yup.string()
    .matches(/^\d{10}$/, "Teléfono inválido, debe tener 10 dígitos")
    .notRequired(),
  // foto: Quita la validación de la foto aquí
  fotografiaDelConductor: Yup.mixed()
    .test(
      "fileTypeOrUrl",
      "Solo se permiten imágenes JPG, JPEG o PNG",
      (value) => {
        if (!value) return true; // No es obligatorio
        if (typeof value === "string") return true; // Ya es una URL válida
        return (
          value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
        );
      }
    )
    .notRequired(),
});

const Perfil = () => {
  const { auth } = useContext(AuthContext);
  const formikPerfilRef = useRef();

  const navigate = useNavigate();
  //Acciones para mostrar la pantalla emergente
  const [modalType, setModalType] = useState(null);
  const handleShowModal = (type) => setModalType(type);
  const handleCloseModal = () => {
    setModalType(null);
    if (modalType === "perfil" && formikPerfilRef.current) {
      formikPerfilRef.current.resetForm();
    }
    if (modalType === "password") {
      formikPassword.resetForm();
    }
  };

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
          // Limpiar campos y cerrar modal después del toast
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
          setTimeout(() => {
            setMensaje({});
          }, 3000);
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
        setTimeout(() => {
          setMensaje({});
        }, 3000);
      } else {
        setMensaje({
          respuesta: "Ocurrió un error inesperado",
          tipo: false,
        });
        toast.error("Ocurrió un error inesperado", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          setMensaje({});
        }, 3000);
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
    cedula: auth.cedula || "",
    cooperativa: auth.cooperativa || "",
    placaAutomovil: auth.placaAutomovil || "",
    email: auth.email || "",
    fotografiaDelConductor: auth.fotografiaDelConductor || "",
    nombre: auth.nombre || "",
    apellido: auth.apellido || "",
  });

  const [preview, setPreview] = useState(auth.fotografiaDelConductor || ""); // Preview de la imagen

  // Actualiza el formulario cada vez que se abre el modal de perfil
  useEffect(() => {
    if (modalType === "perfil") {
      setFormPerfil({
        telefono: auth.telefono || "",
        cedula: auth.cedula || "",
        cooperativa: auth.cooperativa || "",
        placaAutomovil: auth.placaAutomovil || "",
        email: auth.email || "",
        fotografiaDelConductor: auth.fotografiaDelConductor || "",
        nombre: auth.nombre || "",
        apellido: auth.apellido || "",
      });
      setPreview(auth.fotografiaDelConductor || "");
    }
  }, [modalType, auth]);

  const handleChangePerfil = (e) => {
    setFormPerfil({
      ...formPerfil,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitPerfil = async (e) => {
    e.preventDefault();
    // Validar que todos los campos estén llenos
    if (
      Object.values(formPerfil).includes("") ||
      !formPerfil.fotografiaDelConductor
    ) {
      toast.error("Todos los campos deben ser llenados, incluida la foto", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("telefono", formPerfil.telefono);
    formData.append("cedula", formPerfil.cedula);
    formData.append("cooperativa", formPerfil.cooperativa);
    formData.append("placaAutomovil", formPerfil.placaAutomovil);
    formData.append("email", formPerfil.email);
    formData.append("nombre", formPerfil.nombre);
    formData.append("apellido", formPerfil.apellido);
    formData.append(
      "fotografiaDelConductor",
      formPerfil.fotografiaDelConductor
    );

    try {
      const token = localStorage.getItem("token");
      const url = `${
        import.meta.env.VITE_URL_BACKEND
      }/actualizar/informacion/admin`;
      const options = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      const respuesta = await axios.patch(url, formData, options);
      await cargarPerfil(token);
      if (respuesta.data.msg_actualizacion_perfil) {
        handleCloseModal();
        if (
          respuesta.data.msg_actualizacion_perfil ===
          "Se ha enviado un enlace de confirmación al nuevo correo electrónico"
        ) {
          Swal.fire({
            icon: "success",
            title: "Perfil actualizado",
            text: respuesta.data.msg_actualizacion_perfil,
            confirmButtonText: "Ir a Login",
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("rol");
            navigate("/login");
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Perfil actualizado",
            text: respuesta.data.msg_actualizacion_perfil,
            confirmButtonText: "OK",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.msg_actualizacion_perfil ||
          "Error al actualizar el perfil",
        confirmButtonText: "OK",
      });
    }
  };

  // Contraseña - Formik
  const formikPassword = useFormik({
    initialValues: {
      passwordAnterior: "",
      passwordActual: "",
      passwordActualConfirm: "",
    },
    validationSchema: passwordSchema,
    onSubmit: async (values, { resetForm }) => {
      const resultado = await UpdatePassword(values);
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
          Swal.fire({
            icon: "success",
            title: "Contraseña actualizada",
            text: resultado.msg_actualizacion_contrasenia,
            confirmButtonText: "OK",
          }).then(() => {
            setMensaje({});
            resetForm();
            handleCloseModal();
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: resultado.msg_actualizacion_contrasenia,
            confirmButtonText: "OK",
          }).then(() => setMensaje({}));
        }
      } else if (resultado.msg) {
        setMensaje({
          respuesta: resultado.msg,
          tipo: false,
        });
        Swal.fire({
          icon: "error",
          title: "Error",
          text: resultado.msg,
          confirmButtonText: "OK",
        }).then(() => setMensaje({}));
      } else {
        setMensaje({
          respuesta: "Ocurrió un error inesperado",
          tipo: false,
        });
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error inesperado",
          confirmButtonText: "OK",
        }).then(() => setMensaje({}));
      }
    },
  });

  // Perfil - Formik
  const formikPerfil = useFormik({
    enableReinitialize: true,
    initialValues: {
      nombre: auth.nombre || "",
      apellido: auth.apellido || "",
      email: auth.email || "",
      cedula: auth.cedula || "",
      cooperativa: auth.cooperativa || "",
      placaAutomovil: auth.placaAutomovil || "",
      telefono: auth.telefono || "",
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
        }/actualizar/informacion/admin`;
        const options = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        };

        const respuesta = await axios.patch(url, formData, options);
        await cargarPerfil(token);
        if (respuesta.data.msg_actualizacion_perfil) {
          handleCloseModal();
          if (
            respuesta.data.msg_actualizacion_perfil ===
            "Se ha enviado un enlace de confirmación al nuevo correo electrónico"
          ) {
            Swal.fire({
              icon: "success",
              title: "Perfil actualizado",
              text: respuesta.data.msg_actualizacion_perfil,
              confirmButtonText: "Ir a Login",
              allowOutsideClick: false,
              allowEscapeKey: false,
            }).then(() => {
              localStorage.removeItem("token");
              localStorage.removeItem("rol");
              navigate("/login");
            });
          } else {
            Swal.fire({
              icon: "success",
              title: "Perfil actualizado",
              text: respuesta.data.msg_actualizacion_perfil,
              confirmButtonText: "OK",
            });
          }
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response?.data?.msg_actualizacion_perfil ||
            "Error al actualizar el perfil",
          confirmButtonText: "OK",
        });
      }
    },
  });
  formikPerfilRef.current = formikPerfil;

  // Imagen para perfil
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      formikPerfil.setFieldValue("fotografiaDelConductor", file); // <--- aquí el nombre correcto
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
      <style>
        {`
      .form-control.is-invalid, .was-validated .form-control:invalid {
        background-image: none !important;
      }
    `}
      </style>
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
                    <strong>Nombre:</strong> {auth.nombre}
                  </p>
                  <p>
                    <strong>Apellido:</strong> {auth.apellido}
                  </p>
                  <p>
                    <strong>Cédula:</strong> {auth.cedula}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {auth.telefono}
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
              <Form onSubmit={formikPerfil.handleSubmit}>
                <Form.Group className="mb-3" controlId="nombre">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formikPerfil.values.nombre}
                    onChange={formikPerfil.handleChange}
                    onBlur={formikPerfil.handleBlur}
                    isInvalid={
                      !!formikPerfil.errors.nombre &&
                      formikPerfil.touched.nombre
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formikPerfil.errors.nombre}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="apellido">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    name="apellido"
                    value={formikPerfil.values.apellido}
                    onChange={formikPerfil.handleChange}
                    onBlur={formikPerfil.handleBlur}
                    isInvalid={
                      !!formikPerfil.errors.apellido &&
                      formikPerfil.touched.apellido
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formikPerfil.errors.apellido}
                  </Form.Control.Feedback>
                </Form.Group>
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
                  <Form.Control.Feedback type="invalid">
                    {formikPerfil.errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="cedula">
                  <Form.Label>Cédula</Form.Label>
                  <Form.Control
                    type="text"
                    name="cedula"
                    value={formikPerfil.values.cedula}
                    onChange={formikPerfil.handleChange}
                    onBlur={formikPerfil.handleBlur}
                    isInvalid={
                      !!formikPerfil.errors.cedula &&
                      formikPerfil.touched.cedula
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formikPerfil.errors.cedula}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="cooperativa">
                  <Form.Label>Cooperativa</Form.Label>
                  <Form.Control
                    type="text"
                    name="cooperativa"
                    value={formikPerfil.values.cooperativa}
                    onChange={formikPerfil.handleChange}
                    onBlur={formikPerfil.handleBlur}
                    isInvalid={
                      !!formikPerfil.errors.cooperativa &&
                      formikPerfil.touched.cooperativa
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formikPerfil.errors.cooperativa}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="placaAutomovil">
                  <Form.Label>Placa del Vehículo</Form.Label>
                  <Form.Control
                    type="text"
                    name="placaAutomovil"
                    value={formikPerfil.values.placaAutomovil}
                    onChange={formikPerfil.handleChange}
                    onBlur={formikPerfil.handleBlur}
                    isInvalid={
                      !!formikPerfil.errors.placaAutomovil &&
                      formikPerfil.touched.placaAutomovil
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formikPerfil.errors.placaAutomovil}
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
                  <Form.Control.Feedback type="invalid">
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
                    style={{ backgroundColor: "#FF3737", border: "none" }}
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="success"
                    style={{ backgroundColor: "#4CAF50", border: "none" }}
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
              {/* Asegúrate de que el formulario envuelve correctamente los elementos */}
              <Form onSubmit={formikPassword.handleSubmit}>
                {mensaje.respuesta && (
                  <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
                )}

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
                      isInvalid={
                        !!formikPassword.errors.passwordAnterior &&
                        formikPassword.touched.passwordAnterior
                      }
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
                  <Form.Text className="text-muted">
                    Ejemplo: Abr980+++
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {formikPassword.errors.passwordAnterior}
                  </Form.Control.Feedback>
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
                      isInvalid={
                        !!formikPassword.errors.passwordActual &&
                        formikPassword.touched.passwordActual
                      }
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
                  <Form.Control.Feedback type="invalid">
                    {formikPassword.errors.passwordActual}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="passwordActualConfirm">
                  <Form.Label>Confirmar nueva Contraseña</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPasswordConfirm ? "text" : "password"}
                      name="passwordActualConfirm"
                      placeholder="Confirme su nueva contraseña"
                      value={formikPassword.values.passwordActualConfirm}
                      onChange={formikPassword.handleChange}
                      onBlur={formikPassword.handleBlur}
                      isInvalid={
                        !!formikPassword.errors.passwordActualConfirm &&
                        formikPassword.touched.passwordActualConfirm
                      }
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
                  <Form.Control.Feedback type="invalid">
                    {formikPassword.errors.passwordActualConfirm}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Botones dentro del formulario */}
                <Modal.Footer>
                  <Button
                    variant="success"
                    style={{ backgroundColor: "#FF3737", border: "none" }}
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="success"
                    style={{ backgroundColor: "#4CAF50", border: "none" }}
                    type="submit"
                  >
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
