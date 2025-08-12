import React, { useState } from "react";
import { Container, Form, Button, ProgressBar } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import NoUser from "../../assets/NoUser.avif";
import { useFormik } from "formik";
import * as Yup from "yup";

const onlyLetters = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
const sectorRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]+$/;

const FormularioRegistro = () => {
  const [step, setStep] = useState(1);
  const [imagenPreview, setImagenPreview] = useState(null);

  // Yup validation schema
  const validationSchemas = [
    // Paso 1
    Yup.object({
      nombre: Yup.string()
        .trim("No se permiten espacios al inicio o final")
        .matches(onlyLetters, "Solo se permiten letras")
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(20, "El nombre no debe superar los 20 caracteres")
        .required("El nombre es obligatorio"),
      apellido: Yup.string()
        .trim("No se permiten espacios al inicio o final")
        .matches(onlyLetters, "Solo se permiten letras")
        .min(3, "El apellido debe tener al menos 3 caracteres")
        .max(20, "El apellido no debe superar los 20 caracteres")
        .required("El apellido es obligatorio"),
      telefono: Yup.string()
        .trim("No se permiten espacios al inicio o final")
        .matches(/^\d{10}$/, "Número de celular inválido (10 dígitos)")
        .required("El número de celular es obligatorio"),
      cedula: Yup.string()
        .trim("No se permiten espacios al inicio o final")
        .matches(/^\d{10}$/, "La cédula debe tener 10 dígitos")
        .required("La cédula es obligatoria"),
    }),
    // Paso 2
    Yup.object({
      email: Yup.string()
        .trim("No se permiten espacios al inicio o final")
        .email("Correo inválido")
        .required("El correo es obligatorio"),
      generoConductor: Yup.string()
        .oneOf(
          ["Masculino", "Femenino", "Prefiero no decirlo"],
          "Seleccione un género válido"
        )
        .required("Seleccione un género"),
      fotografiaDelConductor: Yup.mixed()
        .required("La foto es obligatoria")
        .test(
          "fileType",
          "Solo se permiten archivos JPG, JPEG o PNG",
          (value) =>
            value &&
            ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
        ),
    }),
    // Paso 3
    Yup.object({
      placaAutomovil: Yup.string()
        .trim("No se permiten espacios al inicio o final")
        .matches(
          /^[A-Z]{3}-\d{4}$/,
          "Formato de placa inválido. Ejemplo: PRT-9888"
        )
        .required("La placa es obligatoria"),
      cooperativa: Yup.string()
        .trim("No se permiten espacios al inicio o final")
        .matches(onlyLetters, "Solo se permiten letras")
        .min(3, "La cooperativa debe tener al menos 3 caracteres")
        .max(30, "La cooperativa no debe superar los 30 caracteres")
        .required("La cooperativa es obligatoria"),
      esReemplazo: Yup.string()
        .oneOf(["Sí", "No"], "Seleccione una opción válida")
        .required("Seleccione una opción"),
      rutaAsignada: Yup.string().when("esReemplazo", {
        is: "No",
        then: (schema) =>
          schema
            .trim("No se permiten espacios al inicio o final")
            .required("La ruta es obligatoria")
            .matches(/^(1[0-2]|[1-9])$/, "Solo hay rutas del 1 al 12"),
        otherwise: (schema) => schema.notRequired().nullable(),
      }),
      sectoresRuta: Yup.string().when("esReemplazo", {
        is: "No",
        then: (schema) =>
          schema
            .trim("No se permiten espacios al inicio o final")
            .matches(sectorRegex,"Solo se permiten letras y números")
            .min(3, "El sector debe tener al menos 3 caracteres")
            .max(30, "El sector no debe superar los 30 caracteres")
            .required("El sector es obligatorio"),
        otherwise: (schema) => schema.notRequired().nullable(),
      }),
    }),
  ];

  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      telefono: "",
      cedula: "",
      email: "",
      institucion: "Unidad Educativa Particular Emaús",
      generoConductor: "",
      fotografiaDelConductor: null,
      placaAutomovil: "",
      cooperativa: "",
      esReemplazo: "",
      rutaAsignada: "",
      sectoresRuta: "",
    },
    validationSchema: validationSchemas[step - 1], // <-- usa el esquema del paso actual
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      const formDataToSend = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formDataToSend.append(key, value ?? "");
      });

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
          resetForm();
          setImagenPreview(null);
          setStep(1);
        }
      } catch (error) {
        if (error.response && error.response.data) {
          const backendResponse = error.response.data;
          // Mostrar todos los mensajes posibles
          if (backendResponse.errors && Array.isArray(backendResponse.errors)) {
            backendResponse.errors.forEach((err) => {
              toast.error(err.msg || err);
            });
          }
          if (backendResponse.msg_registro_conductor) {
            toast.error(backendResponse.msg_registro_conductor);
          }
          if (backendResponse.msg_registro_representante) {
            toast.error(backendResponse.msg_registro_representante);
          }
          if (backendResponse.msg) {
            toast.error(backendResponse.msg);
          }
          // Si hay un error genérico
          if (
            !backendResponse.errors &&
            !backendResponse.msg_registro_conductor &&
            !backendResponse.msg_registro_representante &&
            !backendResponse.msg
          ) {
            toast.error(
              "Error desconocido. Por favor, verifica los datos e intenta nuevamente."
            );
          }
        } else {
          toast.error("Error de red. Por favor, intenta nuevamente.");
        }
      }
    },
  });

  // Manejo de pasos
  const nextStep = async () => {
    const errors = await formik.validateForm();
    formik.setTouched(
      Object.keys(validationSchemas[step - 1].fields).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      )
    );
    if (Object.keys(errors).length === 0) {
      setStep(step + 1);
    }
  };
  const prevStep = () => setStep(step - 1);

  // Imagen
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue("fotografiaDelConductor", file);
    if (file) setImagenPreview(URL.createObjectURL(file));
    else setImagenPreview(null);
  };

  React.useEffect(() => {
    if (formik.values.esReemplazo === "Sí") {
      formik.setFieldValue("rutaAsignada", "");
      formik.setFieldValue("sectoresRuta", "");
    }
  }, [formik.values.esReemplazo]);

  const progress = (step / 3) * 100;

  return (
    <>
      <ToastContainer />
      <Container className="mt-4">
        <ProgressBar variant="success" now={progress} className="mb-4" />
        <Form onSubmit={formik.handleSubmit}>
          {step === 1 && (
            <>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "bold" }}>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formik.values.nombre}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Ingrese el Nombre"
                  isInvalid={!!formik.errors.nombre && formik.touched.nombre}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.nombre}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "bold" }}>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  name="apellido"
                  value={formik.values.apellido}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Ingrese el Apellido"
                  isInvalid={
                    !!formik.errors.apellido && formik.touched.apellido
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.apellido}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "bold" }}>
                  Número de celular
                </Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  value={formik.values.telefono}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Ingrese el número de celular (10 dígitos)"
                  isInvalid={
                    !!formik.errors.telefono && formik.touched.telefono
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.telefono}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "bold" }}>Cédula</Form.Label>
                <Form.Control
                  type="text"
                  name="cedula"
                  value={formik.values.cedula}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Ingrese su cédula (solo 10 dígitos)"
                  isInvalid={!!formik.errors.cedula && formik.touched.cedula}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.cedula}
                </Form.Control.Feedback>
              </Form.Group>
              <Button
                variant="success"
                className="mt-1"
                style={{ backgroundColor: "#32CD32", border: "none" }}
                onClick={nextStep}
                type="button"
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
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Ingrese el correo electrónico"
                  isInvalid={!!formik.errors.email && formik.touched.email}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "bold" }}>
                  Institución
                </Form.Label>
                <Form.Control
                  type="text"
                  name="institucion"
                  value={formik.values.institucion}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "bold" }}>Género</Form.Label>
                <Form.Select
                  name="generoConductor"
                  value={formik.values.generoConductor}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!formik.errors.generoConductor &&
                    formik.touched.generoConductor
                  }
                >
                  <option value="">Seleccione un género</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Prefiero no decirlo">
                    Prefiero no decirlo
                  </option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.generoConductor}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "bold" }}>
                  Foto del Conductor
                </Form.Label>
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
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!formik.errors.fotografiaDelConductor &&
                    formik.touched.fotografiaDelConductor
                  }
                />
                {formik.values.fotografiaDelConductor && (
                  <div
                    className="mt-2"
                    style={{ fontSize: "0.9em", color: "#555" }}
                  >
                    Archivo seleccionado:{" "}
                    {formik.values.fotografiaDelConductor.name}
                  </div>
                )}
                <Form.Control.Feedback type="invalid">
                  {formik.errors.fotografiaDelConductor}
                </Form.Control.Feedback>
              </Form.Group>
              <Button
                variant="success"
                style={{ backgroundColor: "#333333", border: "none" }}
                onClick={prevStep}
                className="me-2 mt-1"
                type="button"
              >
                Atrás
              </Button>
              <Button
                variant="success"
                style={{ backgroundColor: "#32CD32", border: "none" }}
                onClick={nextStep}
                className="mt-1"
                type="button"
              >
                Siguiente
              </Button>
            </>
          )}

          {step === 3 && (
            <>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "bold" }}>
                  Placa del Automóvil
                </Form.Label>
                <Form.Control
                  type="text"
                  name="placaAutomovil"
                  value={formik.values.placaAutomovil}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Ingrese las placas. Ejemplo: PHT-8888 "
                  isInvalid={
                    !!formik.errors.placaAutomovil &&
                    formik.touched.placaAutomovil
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.placaAutomovil}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "bold" }}>
                  Cooperativa
                </Form.Label>
                <Form.Control
                  type="text"
                  name="cooperativa"
                  value={formik.values.cooperativa}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Ingrese la cooperativa"
                  isInvalid={
                    !!formik.errors.cooperativa && formik.touched.cooperativa
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.cooperativa}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "bold" }}>
                  ¿El conductor registrado es o no un conductor reemplazo?
                </Form.Label>
                <Form.Select
                  name="esReemplazo"
                  value={formik.values.esReemplazo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!formik.errors.esReemplazo && formik.touched.esReemplazo
                  }
                >
                  <option value="">Seleccione una opción</option>
                  <option value="Sí">Sí es conductor remplazo</option>
                  <option value="No">No es conductor remplazo</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.esReemplazo}
                </Form.Control.Feedback>
              </Form.Group>
              {formik.values.esReemplazo === "No" && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "bold" }}>
                      Ruta Asignada
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="rutaAsignada"
                      value={formik.values.rutaAsignada}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Ingrese la ruta (Ejm: 11)"
                      isInvalid={
                        !!formik.errors.rutaAsignada &&
                        formik.touched.rutaAsignada
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.rutaAsignada}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "bold" }}>
                      Sectores de la Ruta
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="sectoresRuta"
                      value={formik.values.sectoresRuta}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Ingrese el sector (Ejm: La Mariscal)"
                      isInvalid={
                        !!formik.errors.sectoresRuta &&
                        formik.touched.sectoresRuta
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.sectoresRuta}
                    </Form.Control.Feedback>
                  </Form.Group>
                </>
              )}
              <Button
                variant="success"
                style={{ backgroundColor: "#333333", border: "none" }}
                onClick={prevStep}
                className="me-2 mt-1"
                type="button"
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
