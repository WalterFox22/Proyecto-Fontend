import React, { useContext, useState } from "react";
import { Form, Button, ProgressBar, Container } from "react-bootstrap";
import EstudientesContext from "../../../context/StudentsProvider";
import { toast, ToastContainer } from "react-toastify";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const googleMapsRegex =
  /^(https?:\/\/)?(www\.)?(google\.[a-z.]+\/maps|goo\.gl\/maps|maps\.app\.goo\.gl)\/[^\s]+/i;

const validationSchemas = [
  // Paso 1
  Yup.object({
    nombre: Yup.string()
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo letras y espacios")
      .required("El nombre es obligatorio"),
    apellido: Yup.string()
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo letras y espacios")
      .required("El apellido es obligatorio"),
    genero: Yup.string().required("El género es obligatorio"),
    cedula: Yup.string()
      .matches(/^\d{10}$/, "La cédula debe tener 10 dígitos numéricos")
      .required("La cédula es obligatoria"),
  }),
  // Paso 2
  Yup.object({
    nivelEscolar: Yup.string().required("El nivel escolar es obligatorio"),
    paralelo: Yup.string().required("El paralelo es obligatorio"),
  }),
  // Paso 3
  Yup.object({
    turno: Yup.string().required("El turno es obligatorio"),
    ubicacionDomicilio: Yup.string()
  .test(
    "is-google-maps-url",
    "Debe ser una URL válida de Google Maps",
    (value) => !!value && googleMapsRegex.test(value)
  )
  .required("La dirección es obligatoria"),
  }),
];

const initialValues = {
  nombre: "",
  apellido: "",
  nivelEscolar: "",
  genero: "",
  paralelo: "",
  cedula: "",
  ubicacionDomicilio: "",
  turno: "",
};

const FormularioEstudiante = () => {
  const { RegistrarEstudiantes } = useContext(EstudientesContext);
  const [step, setStep] = useState(0);

  const progress = ((step + 1) / 3) * 100;

  const handleSubmit = async (values, actions) => {
    try {
      const resultado = await RegistrarEstudiantes(values);
      if (
        resultado &&
        resultado.msg_registro_estudiantes ===
          "Estudiante registrado exitosamente"
      ) {
        toast.success("Estudiante Registrado correctamente", {
          position: "top-right",
          autoClose: 3000,
        });
        actions.resetForm();
        setStep(0);
      } else if (resultado && resultado.error) {
        toast.error(
          resultado.error.msg_registro_estudiantes ||
            "Ocurrió un error inesperado",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      } else {
        toast.error("Ocurrió un error inesperado al registrar el estudiante", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Error al procesar la solicitud. Inténtalo nuevamente.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      actions.setSubmitting(false);
      actions.setTouched({});
      actions.setErrors({});
    }
  };

  return (
    <>
      <ToastContainer />
      <Container className="mt-4">
        <h2 className="text-center mb-3">Registrar Estudiante</h2>
        <ProgressBar variant="success" now={progress} className="mb-4" />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchemas[step]}
          validateOnChange={false}
          validateOnBlur={true}
          onSubmit={(values, actions) => {
            if (step < 2) {
              actions.setTouched({});
              actions.setErrors({});
              actions.setSubmitting(false);
              setStep(step + 1);
            } else {
              handleSubmit(values, actions);
            }
          }}
        >
          {({
            handleSubmit,
            isSubmitting,
            errors,
            touched,
            validateForm,
            setTouched,
            setErrors,
            setSubmitting,
          }) => (
            <Form onSubmit={handleSubmit}>
              {step === 0 && (
                <>
                  <Form.Group className="mb-2">
                    <Form.Label>Nombre</Form.Label>
                    <Field
                      as={Form.Control}
                      type="text"
                      name="nombre"
                      autoComplete="off"
                    />
                    <ErrorMessage
                      name="nombre"
                      component="div"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Apellido</Form.Label>
                    <Field
                      as={Form.Control}
                      type="text"
                      name="apellido"
                      autoComplete="off"
                    />
                    <ErrorMessage
                      name="apellido"
                      component="div"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Género</Form.Label>
                    <Field as={Form.Select} name="genero">
                      <option value="">Seleccione un género</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Prefiero no decirlo">
                        Prefiero no decirlo
                      </option>
                    </Field>
                    <ErrorMessage
                      name="genero"
                      component="div"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Cédula</Form.Label>
                    <Field
                      as={Form.Control}
                      type="text"
                      name="cedula"
                      autoComplete="off"
                    />
                    <ErrorMessage
                      name="cedula"
                      component="div"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Button
                    variant="success"
                    className="mt-1"
                    style={{ backgroundColor: "#32CD32", border: "none" }}
                    onClick={async (e) => {
                      e.preventDefault();
                      const formErrors = await validateForm();
                      setTouched({
                        nombre: true,
                        apellido: true,
                        genero: true,
                        cedula: true,
                      });
                      if (Object.keys(formErrors).length === 0) {
                        setStep(1);
                        setTouched({});
                        setErrors({});
                        setSubmitting(false);
                      } else {
                        setSubmitting(false);
                      }
                    }}
                  >
                    Siguiente
                  </Button>
                </>
              )}

              {step === 1 && (
                <>
                  <Form.Group className="mb-2">
                    <Form.Label>Nivel Escolar</Form.Label>
                    <Field as={Form.Select} name="nivelEscolar">
                      <option value="">Seleccione un nivel escolar</option>
                      <option value="Nocional">Nocional</option>
                      <option value="Inicial 1">Inicial 1</option>
                      <option value="Inicial 2">Inicial 2</option>
                      <option value="Primero de básica">
                        Primero de básica
                      </option>
                      <option value="Segundo de básica">
                        Segundo de básica
                      </option>
                      <option value="Tercero de básica">
                        Tercero de básica
                      </option>
                      <option value="Cuarto de básica">Cuarto de básica</option>
                      <option value="Quinto de básica">Quinto de básica</option>
                      <option value="Sexto de básica">Sexto de básica</option>
                      <option value="Séptimo de básica">
                        Séptimo de básica
                      </option>
                      <option value="Octavo de básica">Octavo de básica</option>
                      <option value="Noveno de básica">Noveno de básica</option>
                      <option value="Décimo de básica">Décimo de básica</option>
                      <option value="Primero de bachillerato">
                        Primero de bachillerato
                      </option>
                      <option value="Segundo de bachillerato">
                        Segundo de bachillerato
                      </option>
                      <option value="Tercero de bachillerato">
                        Tercero de bachillerato
                      </option>
                    </Field>
                    <ErrorMessage
                      name="nivelEscolar"
                      component="div"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Paralelo</Form.Label>
                    <Field as={Form.Select} name="paralelo">
                      <option value="">Seleccione un paralelo</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </Field>
                    <ErrorMessage
                      name="paralelo"
                      component="div"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Button
                    variant="success"
                    style={{ backgroundColor: "#333333", border: "none" }}
                    onClick={(e) => {
                      e.preventDefault();
                      setStep(0);
                      setTouched({});
                      setErrors({});
                      setSubmitting(false);
                    }}
                    className="me-2 mt-1"
                  >
                    Atrás
                  </Button>
                  <Button
                    variant="success"
                    style={{ backgroundColor: "#32CD32", border: "none" }}
                    className="mt-1"
                    onClick={async (e) => {
                      e.preventDefault();
                      const formErrors = await validateForm();
                      setTouched({
                        nivelEscolar: true,
                        paralelo: true,
                      });
                      if (Object.keys(formErrors).length === 0) {
                        setStep(2);
                        setTouched({});
                        setErrors({});
                        setSubmitting(false);
                      } else {
                        setSubmitting(false);
                      }
                    }}
                  >
                    Siguiente
                  </Button>
                </>
              )}

              {step === 2 && (
                <>
                  <Form.Group className="mb-2">
                    <Form.Label>Horario de Recorrido</Form.Label>
                    <Field as={Form.Select} name="turno">
                      <option value="">Seleccione un turno</option>
                      <option value="Mañana">Mañana</option>
                      <option value="Tarde">Tarde</option>
                      <option value="Completo">Completo</option>
                    </Field>
                    <ErrorMessage
                      name="turno"
                      component="div"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Dirección del Domicilio</Form.Label>
                    <Field
                      as={Form.Control}
                      type="url"
                      name="ubicacionDomicilio"
                      autoComplete="off"
                    />
                    <Form.Text className="text-muted">
                      Ejemplo: https://maps.google.com/Direccion
                    </Form.Text>
                    <ErrorMessage
                      name="ubicacionDomicilio"
                      component="div"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Button
                    variant="success"
                    style={{ backgroundColor: "#333333", border: "none" }}
                    onClick={(e) => {
                      e.preventDefault();
                      setStep(1);
                      setTouched({});
                      setErrors({});
                      setSubmitting(false);
                    }}
                    className="me-2 mt-1"
                  >
                    Atrás
                  </Button>
                  <Button
                    type="submit"
                    variant="success"
                    style={{ backgroundColor: "#FF9900", border: "none" }}
                    className="mt-1"
                    disabled={isSubmitting}
                  >
                    Registrar
                  </Button>
                </>
              )}
            </Form>
          )}
        </Formik>
      </Container>
    </>
  );
};

export default FormularioEstudiante;
