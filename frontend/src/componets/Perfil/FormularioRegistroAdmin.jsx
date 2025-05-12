import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import { Button, Container, Form, ProgressBar } from "react-bootstrap";
import NoUser from "../../assets/NoUser.avif";

const FormularioRegistroAdmin = () => {
  const { NewAdmin, auth } = useContext(AuthContext);
  const [step, setStep] = useState(1); // Logica para el manejo del formulario de multples pasos

  const [form, setForm] = useState({
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
    foto: "",
  });
  const [preview, setPreview] = useState(null); // Preview de la imagen
  const [rutaEditable, setRutaEditable] = useState(false); // Controla si los campos de ruta y sector son editables

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAsignacionChange = (e) => {
    const value = e.target.value;
    setForm({
      ...form,
      asignacionOno: value,
    });

    if (value === "No") {
      // Si se selecciona "No", los campos serán editables
      setRutaEditable(true);
    } else {
      // Si se selecciona "Sí", ocultar los campos y limpiar los valores
      setRutaEditable(false);
      setForm((prevForm) => ({
        ...prevForm,
        rutaAsignada: "",
        sectoresRuta: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(form).includes("") || !form.foto) {
      toast.error("Todos los campos deben ser llenados, incluida la foto");
      return;
    }
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });
    formData.append("fotografiaDelConductor", form.foto); // Asegurarse de enviar la foto con el nombre correcto

    try {
      const respuesta = await NewAdmin(formData);
      if (respuesta) {
        toast.success("Administrador registrado con éxito");

        // Limpiar los campos del formulario y regresar al paso 1
        setForm({
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
          foto: "",
        });
        setPreview(null); // Restablece la imagen a la predeterminada
        setStep(1); // Regresar al paso 1
      } else {
        toast.error(respuesta.data.msg_registro_conductor);
      }
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      toast.error("Error al procesar la solicitud. Inténtalo nuevamente.");
    }
  };

  // Se establece los parametros para la logica del formulario multiple
  const nextStep = () =>setStep(step + 1);
  const prevStep = () => setStep(step - 1);
    


  // Se establece el numero de formulario que se va a tener en miltiples pasos para mostrar en la barra de progreso
  const progress = (step / 5) * 100;

  return (
    <>
      <ToastContainer />
      <Container className="mt-4">
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
                <Form.Label>Telefóno</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Genero</Form.Label>
                <Form.Select
                  as="select"
                  name="generoConductor"
                  value={form.generoConductor}
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
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Placa del Automovil</Form.Label>
                <Form.Control
                  type="text"
                  name="placaAutomovil"
                  value={form.placaAutomovil}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Cooperativa</Form.Label>
                <Form.Control
                  type="text"
                  name="cooperativa"
                  value={form.cooperativa}
                  onChange={handleChange}
                  required
                />
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
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setPreview(URL.createObjectURL(file)); // Actualiza la previsualización
                      setForm({ ...form, foto: file }); // Guarda la imagen en el formulario
                    }
                  }}
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
                <Form.Label>
                  ¿El nuevo administrador trabajará como conductor?
                </Form.Label>
                <Form.Select
                  name="trabajaraOno"
                  value={form.trabajaraOno}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una opción</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
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

          {step === 4 && (
            <>
              <Form.Group className="mb-2">
                <Form.Label>
                  ¿Desea asignar sus estudiantes al nuevo administrador, esto
                  con ruta y sector?
                </Form.Label>
                <Form.Select
                  name="asignacionOno"
                  value={form.asignacionOno}
                  onChange={handleAsignacionChange}
                  required
                >
                  <option value="">Seleccione una opción</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </Form.Select>
              </Form.Group>

              {form.asignacionOno === "No" && (
                <>
                  <Form.Group className="mb-2">
                    <Form.Label>Ruta Asignada</Form.Label>
                    <Form.Control
                      type="text"
                      name="rutaAsignada"
                      value={form.rutaAsignada}
                      onChange={handleChange}
                      readOnly={!rutaEditable} // Solo editable si rutaEditable es true
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Sectores de la Ruta</Form.Label>
                    <Form.Control
                      type="text"
                      name="sectoresRuta"
                      value={form.sectoresRuta}
                      onChange={handleChange}
                      readOnly={!rutaEditable} // Solo editable si rutaEditable es true
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
                variant="success"
                style={{ backgroundColor: "#32CD32", border: "none" }}
                onClick={nextStep}
                className="mt-1"
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
                  value={form.eliminacionAdminSaliente}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una opción</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
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
