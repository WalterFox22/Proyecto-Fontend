import { useContext, useState } from "react";
import AuthContext from "../../context/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import { Button, Container, Form, ProgressBar } from "react-bootstrap";
import NoUser from "../../assets/NoUser.avif";
import { useFormik } from "formik";
import * as Yup from "yup";

const onlyLetters = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
const placaRegex = /^[A-Z]{3}-\d{4}$/;

const validationSchema = Yup.object({
  nombre: Yup.string()
    .matches(onlyLetters, "Solo se permiten letras")
    .required("El nombre es obligatorio"),
  apellido: Yup.string()
    .matches(onlyLetters, "Solo se permiten letras")
    .required("El apellido es obligatorio"),
  telefono: Yup.string()
    .matches(/^\d{7,10}$/, "Teléfono inválido")
    .required("El teléfono es obligatorio"),
  generoConductor: Yup.string()
    .oneOf(
      ["Masculino", "Femenino", "Prefiero no decirlo"],
      "Seleccione un género válido"
    )
    .required("El género es obligatorio"),
  cedula: Yup.string()
    .matches(/^\d{10}$/, "La cédula debe tener 10 dígitos")
    .required("La cédula es obligatoria"),
  email: Yup.string()
    .email("Correo electrónico inválido")
    .required("El correo es obligatorio"),
  placaAutomovil: Yup.string()
    .matches(placaRegex, "Formato de placa inválido. Ejemplo: PRT-9888")
    .required("La placa es obligatoria"),
  cooperativa: Yup.string()
    .matches(onlyLetters, "Solo se permiten letras")
    .required("La cooperativa es obligatoria"),
  foto: Yup.mixed()
    .required("La foto es obligatoria")
    .test(
      "fileType",
      "Solo se permiten imágenes JPG, JPEG o PNG",
      (value) =>
        value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
    ),
  trabajaraOno: Yup.string()
    .oneOf(["Sí", "No"], "Seleccione una opción válida")
    .required("Este campo es obligatorio"),
  asignacionOno: Yup.string()
    .oneOf(["Sí", "No"], "Seleccione una opción válida")
    .required("Este campo es obligatorio"),
  eliminacionAdminSaliente: Yup.string()
    .oneOf(["Sí", "No"], "Seleccione una opción válida")
    .required("Este campo es obligatorio"),
  rutaAsignada: Yup.string().when("asignacionOno", (asignacionOno, schema) =>
    asignacionOno === "No"
      ? schema
          .required("La ruta es obligatoria")
          .matches(/^(1[0-2]|[1-9])$/, "Solo hay rutas del 1 al 12")
      : schema.notRequired()
  ),
  sectoresRuta: Yup.string().when("asignacionOno", (asignacionOno, schema) =>
    asignacionOno === "No"
      ? schema
          .matches(onlyLetters, "Solo se permiten letras")
          .required("El sector es obligatorio")
      : schema.notRequired()
  ),
});

const FormularioRegistroAdmin = () => {
  const { NewAdmin } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [preview, setPreview] = useState(null);

  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      telefono: "",
      placaAutomovil: "",
      generoConductor: "",
      cedula: "",
      cooperativa: "",
      email: "",
      trabajaraOno: "",
      asignacionOno: "",
      eliminacionAdminSaliente: "",
      rutaAsignada: "",
      sectoresRuta: "",
      foto: null,
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value ?? "");
      });
      formData.append("fotografiaDelConductor", values.foto);

      try {
        const respuesta = await NewAdmin(formData);

        // Si el backend responde con status 200 y msg_registro_conductor
        if (
          respuesta &&
          respuesta.data &&
          respuesta.data.msg_registro_conductor &&
          respuesta.status === 200
        ) {
          toast.success(respuesta.data.msg_registro_conductor);
          localStorage.removeItem("token");
          localStorage.removeItem("rol");
          resetForm();
          setPreview(null);
          setStep(1);
        } else if (
          respuesta &&
          respuesta.data &&
          respuesta.data.msg_registro_conductor
        ) {
          // Si hay un mensaje de error personalizado
          toast.error(respuesta.data.msg_registro_conductor);
        } else if (
          respuesta &&
          respuesta.data &&
          respuesta.data.msg_registro_representante
        ) {
          toast.error(respuesta.data.msg_registro_representante);
        } else {
          toast.error("Error desconocido al registrar el administrador.");
        }
      } catch (error) {
        // Si el error viene del backend
        if (error.response && error.response.data) {
          if (error.response.data.msg_registro_conductor) {
            toast.error(error.response.data.msg_registro_conductor);
          } else if (error.response.data.msg_registro_representante) {
            toast.error(error.response.data.msg_registro_representante);
          } else if (error.response.data.msg) {
            toast.error(error.response.data.msg);
          } else {
            toast.error("Error desconocido del servidor.");
          }
        } else {
          toast.error("Error de red. Inténtalo nuevamente.");
        }
      }
    },
  });

  const nextStep = async () => {
    let fields = [];
    if (step === 1)
      fields = ["nombre", "apellido", "telefono", "generoConductor", "cedula"];
    if (step === 2) fields = ["email", "placaAutomovil", "cooperativa", "foto"];
    if (step === 3) fields = ["trabajaraOno"];
    if (step === 4) {
      fields = ["asignacionOno"];
      if (formik.values.asignacionOno === "No") {
        fields.push("rutaAsignada", "sectoresRuta");
      }
    }
    if (step === 5) fields = ["eliminacionAdminSaliente"];
    await formik.validateForm();
    const errors = fields.filter((f) => formik.errors[f]);
    if (errors.length > 0) {
      errors.forEach((f) => toast.error(formik.errors[f]));
      fields.forEach((f) => formik.setFieldTouched(f, true, true));
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue("foto", file);
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(null);
  };

  const progress = (step / 5) * 100;

  return (
    <>
      <ToastContainer />
      <Container className="mt-4">
        <ProgressBar variant="success" now={progress} className="mb-4" />
        <Form onSubmit={formik.handleSubmit}>
          {step === 1 && (
            <>
              <Form.Group className="mb-2">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formik.values.nombre}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.nombre && formik.touched.nombre}
                />
                <Form.Control.Feedback
                  type="invalid"
                  style={{ color: "#e74c3c" }}
                >
                  {formik.errors.nombre}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  name="apellido"
                  value={formik.values.apellido}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!formik.errors.apellido && formik.touched.apellido
                  }
                />
                <Form.Control.Feedback
                  type="invalid"
                  style={{ color: "#e74c3c" }}
                >
                  {formik.errors.apellido}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Telefóno</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  value={formik.values.telefono}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!formik.errors.telefono && formik.touched.telefono
                  }
                />
                <Form.Control.Feedback
                  type="invalid"
                  style={{ color: "#e74c3c" }}
                >
                  {formik.errors.telefono}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Género</Form.Label>
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
                <Form.Control.Feedback
                  type="invalid"
                  style={{ color: "#e74c3c" }}
                >
                  {formik.errors.generoConductor}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Cédula</Form.Label>
                <Form.Control
                  type="text"
                  name="cedula"
                  value={formik.values.cedula}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.cedula && formik.touched.cedula}
                />
                <Form.Control.Feedback
                  type="invalid"
                  style={{ color: "#e74c3c" }}
                >
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
              <Form.Group className="mb-2">
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.email && formik.touched.email}
                />
                <Form.Control.Feedback
                  type="invalid"
                  style={{ color: "#e74c3c" }}
                >
                  {formik.errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Placa del Automóvil</Form.Label>
                <Form.Control
                  type="text"
                  name="placaAutomovil"
                  value={formik.values.placaAutomovil}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!formik.errors.placaAutomovil &&
                    formik.touched.placaAutomovil
                  }
                />
                <Form.Control.Feedback
                  type="invalid"
                  style={{ color: "#e74c3c" }}
                >
                  {formik.errors.placaAutomovil}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Cooperativa</Form.Label>
                <Form.Control
                  type="text"
                  name="cooperativa"
                  value={formik.values.cooperativa}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!formik.errors.cooperativa && formik.touched.cooperativa
                  }
                />
                <Form.Control.Feedback
                  type="invalid"
                  style={{ color: "#e74c3c" }}
                >
                  {formik.errors.cooperativa}
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
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.foto && formik.touched.foto}
                  // No seteamos value, así el usuario puede avanzar y retroceder sin perder la imagen
                />
                <Form.Control.Feedback
                  type="invalid"
                  style={{ color: "#e74c3c" }}
                >
                  {formik.errors.foto}
                </Form.Control.Feedback>
                {/* Si ya hay una imagen seleccionada, muestra un mensaje */}
                {formik.values.foto &&
                  typeof formik.values.foto === "object" && (
                    <div style={{ fontSize: "0.9em", color: "#555" }}>
                      Imagen seleccionada: {formik.values.foto.name}
                    </div>
                  )}
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
              <Form.Group className="mb-2">
                <Form.Label>
                  ¿El nuevo administrador trabajará como conductor?
                </Form.Label>
                <Form.Select
                  name="trabajaraOno"
                  value={formik.values.trabajaraOno}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!formik.errors.trabajaraOno && formik.touched.trabajaraOno
                  }
                >
                  <option value="">Seleccione una opción</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </Form.Select>
                <Form.Control.Feedback
                  type="invalid"
                  style={{ color: "#e74c3c" }}
                >
                  {formik.errors.trabajaraOno}
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

          {step === 4 && (
            <>
              <Form.Group className="mb-2">
                <Form.Label>
                  ¿Desea asignar sus estudiantes al nuevo administrador, esto
                  con ruta y sector?
                </Form.Label>
                <Form.Select
                  name="asignacionOno"
                  value={formik.values.asignacionOno}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!formik.errors.asignacionOno &&
                    formik.touched.asignacionOno
                  }
                >
                  <option value="">Seleccione una opción</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </Form.Select>
                <Form.Control.Feedback
                  type="invalid"
                  style={{ color: "#e74c3c" }}
                >
                  {formik.errors.asignacionOno}
                </Form.Control.Feedback>
              </Form.Group>

              {formik.values.asignacionOno === "No" && (
                <>
                  <Form.Group className="mb-2">
                    <Form.Label>Ruta Asignada</Form.Label>
                    <Form.Control
                      type="text"
                      name="rutaAsignada"
                      value={formik.values.rutaAsignada}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        !!formik.errors.rutaAsignada &&
                        formik.touched.rutaAsignada
                      }
                    />
                    <Form.Control.Feedback
                      type="invalid"
                      style={{ color: "#e74c3c" }}
                    >
                      {formik.errors.rutaAsignada}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Sectores de la Ruta</Form.Label>
                    <Form.Control
                      type="text"
                      name="sectoresRuta"
                      value={formik.values.sectoresRuta}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        !!formik.errors.sectoresRuta &&
                        formik.touched.sectoresRuta
                      }
                    />
                    <Form.Control.Feedback
                      type="invalid"
                      style={{ color: "#e74c3c" }}
                    >
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

          {step === 5 && (
            <>
              <Form.Group className="mb-2">
                <Form.Label>¿Desea eliminarse del sistema?</Form.Label>
                <Form.Select
                  name="eliminacionAdminSaliente"
                  value={formik.values.eliminacionAdminSaliente}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!formik.errors.eliminacionAdminSaliente &&
                    formik.touched.eliminacionAdminSaliente
                  }
                >
                  <option value="">Seleccione una opción</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </Form.Select>
                <Form.Control.Feedback
                  type="invalid"
                  style={{ color: "#e74c3c" }}
                >
                  {formik.errors.eliminacionAdminSaliente}
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
                type="submit"
                variant="success"
                style={{ backgroundColor: "#FF9900", border: "none" }}
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

export default FormularioRegistroAdmin;
