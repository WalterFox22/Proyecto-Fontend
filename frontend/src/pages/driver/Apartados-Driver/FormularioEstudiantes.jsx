import React, { useContext, useState } from "react";
import {Form,Button,ProgressBar,Container,} from "react-bootstrap";
import EstudientesContext from "../../../context/StudentsProvider";
import { toast, ToastContainer } from "react-toastify";
import AuthContext from "../../../context/AuthProvider";

const FormularioEstudiante = () => {
  const { RegistrarEstudiantes } = useContext(EstudientesContext);
  const [step, setStep] = useState(1); // Logica para el manejo del formulario de multples pasos
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    nivelEscolar: "",
    genero: "",
    paralelo: "",
    cedula: "",
    ubicacionDomicilio: "",
    ManianaOTarde: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Se establece los parametros para la logica del formulario multiple 
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(form).includes("")) {
      toast.error("Todos los campos deben ser ingresados", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    try {
      const resultado = await RegistrarEstudiantes(form);
      if (
        resultado &&
        resultado.msg_registro_estudiantes ===
          "Estudiante registrado exitosamente"
      ) {
        toast.success("Estudiante Registrado correctamente", {
          position: "top-right",
          autoClose: 3000,
        });
        // Limpiar los campos del formulario y regresar al paso 1
        setForm({
          nombre: "",
          apellido: "",
          nivelEscolar: "",
          genero: "",
          paralelo: "",
          cedula: "",
          ubicacionDomicilio: "",
          ManianaOTarde: "",
        });
        setStep(1); // Regresar al paso 1
      } else if (resultado.error) {
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
      console.error("Error al procesar la solicitud:", error);
      toast.error("Error al procesar la solicitud. Inténtalo nuevamente.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Se establece el numero de formulario que se va a tener en miltiples pasos para mostrar en la barra de progreso
  const progress = (step / 3) * 100;

  return (
    <>
      <ToastContainer />
      <Container className="mt-4">
        <h2 className="text-center mb-3">Registrar Estudiante</h2>
        <ProgressBar variant="success" now={progress} className="mb-4" />
        <Form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <Form.Group className="mb-2">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Genero</Form.Label>
                <Form.Select
                  as="select"
                  name="genero"
                  value={form.genero}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un género</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Prefiero no decirlo">
                    Prefiero no decirlo
                  </option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Cedula</Form.Label>
                <Form.Control
                  type="text"
                  name="cedula"
                  value={form.cedula}
                  onChange={handleChange}
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
              <Form.Group className="mb-2">
                <Form.Label>Nivel Escolar</Form.Label>
                <Form.Select
                  name="nivelEscolar"
                  value={form.nivelEscolar}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un nivel escolar</option>
                  <option value="Nocional">Nocional</option>
                  <option value="Inicial 1">Inicial 1</option>
                  <option value="Inicial 2">Inicial 2</option>
                  <option value="Primero de básica">Primero de básica</option>
                  <option value="Segundo de básica">Segundo de básica</option>
                  <option value="Tercero de básica">Tercero de básica</option>
                  <option value="Cuarto de básica">Cuarto de básica</option>
                  <option value="Quinto de básica">Quinto de básica</option>
                  <option value="Sexto de básica">Sexto de básica</option>
                  <option value="Séptimo de básica">Séptimo de básica</option>
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
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-2">
                <Form.Label>Paralelo</Form.Label>
                <Form.Select
                  name="paralelo"
                  value={form.paralelo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un paralelo</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </Form.Select>
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
                onClick={nextStep}
                className="mt-1"
              >
                Siguiente
              </Button>
            </>
          )}

          {step === 3 && (
            <>
              <Form.Group className="mb-2">
                <Form.Label>Horario de Recorrido</Form.Label>
                <Form.Select
                  name="ManianaOTarde"
                  value={form.ManianaOTarde}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un paralelo</option>
                  <option value="Mañana">Mañana</option>
                  <option value="Tarde">Tarde</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Direccion del Domicilio</Form.Label>
                <Form.Control
                  type="url"
                  name="ubicacionDomicilio"
                  value={form.ubicacionDomicilio}
                  onChange={handleChange}
                  required
                />
                <Form.Text className="text-muted">
                  Ejemplo: https://maps.google.com/Direccion
                </Form.Text>
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

export default FormularioEstudiante;
