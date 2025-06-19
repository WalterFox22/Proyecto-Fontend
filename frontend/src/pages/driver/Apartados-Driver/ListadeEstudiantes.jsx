import { useContext, useEffect, useState } from "react";
import Mensaje from "../../../componets/Alertas/Mensaje";
import { Button, Card, Form, Modal, Table } from "react-bootstrap";
import Delete from "../../../assets/borrar1.png";
import Update from "../../../assets/actualizar.png";
import Maps from "../../../assets/Maps.png";
import Swal from "sweetalert2";
import AuthContext from "../../../context/AuthProvider";
import axios from "axios";
import "../Styles-Drivers/ListadeEstudiantes.css";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const ListadeEstudiantes = () => {
  const { auth } = useContext(AuthContext);
  const { cargarPerfil } = useContext(AuthContext);
  const [estudiantes, setEstudiantes] = useState([]);
  const [error, setError] = useState(null);
  const [cedula, setCedula] = useState(""); // Cedula que se ingresa para búsqueda (Solo para el apartado de busqueda)

  // MOSTRAR LA LISTA DE ESTUDIANTES
  const RegistroDeListaEstudiantes = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_URL_BACKEND}/lista/estudiantes`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const respuesta = await axios.get(url, options);
      console.log(respuesta);
      setEstudiantes(
        Array.isArray(respuesta.data.listaCompleta)
          ? respuesta.data.listaCompleta
          : []
      );
      setError(null);
    } catch (error) {
      // Si el backend responde 404 y el mensaje es de lista vacía, vacía la tabla y NO muestres error
      if (
        error.response &&
        error.response.status === 404 &&
        error.response.data &&
        error.response.data.msg_lista_estudiantes
      ) {
        setEstudiantes([]); // Vacía la tabla
        setError(null); // No mostrar mensaje de error
      } else {
        console.log(error);
        setError(
          "Ocurrió un error al cargar los estudiantes. Intente nuevamente."
        );
      }
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    RegistroDeListaEstudiantes();
    cargarPerfil(token);
  }, []);

  // ELIMINAR ESTUDIANTES DE LA BASE DE DATOS
  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Vas a eliminar a un estudiante. Si lo eliminas, se eliminara el estudiante y el represenante del sistema.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        const url = `${
          import.meta.env.VITE_URL_BACKEND
        }/eliminar/estudiante/${id}`;
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        // recibimos la respuesta del backend
        await axios.delete(url, { headers });

        // Limpiar error antes de recargar
        setError(null);

        // Mostrar alerta de éxito
        Swal.fire({
          title: "Eliminado",
          text: "El estudiante ha sido eliminado correctamente de la ruta y del sistema.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
        //Actualiza la tabla con los cambios realizados
        await RegistroDeListaEstudiantes();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // BUSCAR EL ESTUDIANTE POR LA CEDULA EN LA BARRA DE BUSQUEDA
  const BuscarEstuByDNA = async () => {
    setError(null);
    // Si el campo de búsqueda está vacío, recargamos toda la lista de estudiantes
    if (!cedula) {
      RegistroDeListaEstudiantes(); // Recarga todos la lista de estudiantes
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const url = `${
        import.meta.env.VITE_URL_BACKEND
      }/buscar/estudiante/cedula/${cedula}`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const respuesta = await axios.get(url, options);
      if (respuesta.data && respuesta.data.estudiante) {
        // Actualiza el estado con el estudiante encontrado
        setEstudiantes([respuesta.data.estudiante]);
        setError(null); // Limpiar el error si se encuentra el estudiante
      } else {
        //setCedula([]);
        setError("No se encontraron estudiante para la cedula especificada");
      }
    } catch (error) {
      console.log(error);
      // No mostrar error si el filtro local ya muestra resultados
      if (estudiantesFiltrados.length === 0) {
        setError("Error al buscar el estudiante. Intente nuevamente.");
      } else {
        setError(null); // Limpiar el error si hay resultados parciales
      }
    }
  };

  // Filtrar los estudiantes solo por la cedula
  const estudiantesFiltrados = Array.isArray(estudiantes)
    ? estudiantes.filter((estudiantes) =>
        String(estudiantes.cedula).toLowerCase().includes(cedula.toLowerCase())
      )
    : []; // Asegurarse de que estudiantesFiltrados sea un array

  // Función para manejar la búsqueda cuando presionas "Enter"
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevenir la acción por defecto del formulario
    if (!cedula) {
      // Si la barra de búsqueda está vacía, recargar toda la lista de conductores
      RegistroDeListaEstudiantes();
    } else {
      BuscarEstuByDNA(); // Realizar la búsqueda con la ruta especificada
    }
  };

  // Efecto para borrar el error cuando cambia la cedula en el buscador
  useEffect(() => {
    setError(null); // Esto borra el mensaje de error cuando se empieza a escribir
  }, [cedula]);

  // ACTUALIZAR EL ESTIDIANTE POR PANTALLA EMERGENTE
  const [show, setShow] = useState(false);
  const [selectedEstudianteId, setSelectedEstudianteId] = useState(null); // Para guardar la informacion del id del estudiante seleccionado

  const [formUpdate, setFormUpdate] = useState({
    nivelEscolar: "",
    paralelo: "",
    ubicacionDomicilio: "",
    turno: "",
  });

  const handleChange = (e) => {
    setFormUpdate({
      ...formUpdate,
      [e.target.name]: e.target.value,
    });
  };

  //Apartado para la pantalla emergente
  const handleClose = () => setShow(false);
  const handleShow = (estudiante) => {
    setFormUpdate({
      nivelEscolar: estudiante.nivelEscolar || "",
      paralelo: estudiante.paralelo || "",
      ubicacionDomicilio: estudiante.ubicacionDomicilio || "",
      turno: estudiante.turno || "",
    });
    setSelectedEstudianteId(estudiante._id); // Guardar el ID del estudiante seleccionado
    setShow(true); // Abrir el modal
  };

  const googleMapsRegex =
    /^(https?:\/\/)?(www\.)?(maps\.google\.com|goo\.gl|maps\.app\.goo\.gl)\/.+$/i;

  const updateValidationSchema = Yup.object({
    nivelEscolar: Yup.string().matches(
      /^$|^(Nocional|Inicial 1|Inicial 2|Primero de básica|Segundo de básica|Tercero de básica|Cuarto de básica|Quinto de básica|Sexto de básica|Séptimo de básica|Octavo de básica|Noveno de básica|Décimo de básica|Primero de bachillerato|Segundo de bachillerato|Tercero de bachillerato)$/,
      "Seleccione un nivel escolar válido"
    ),
    paralelo: Yup.string().matches(
      /^$|^(A|B|C)$/,
      "Seleccione un paralelo válido"
    ),
    turno: Yup.string().matches(
      /^$|^(Mañana|Tarde|Completo)$/,
      "Seleccione un turno válido"
    ),
    ubicacionDomicilio: Yup.string().test(
      "is-google-maps-url",
      "Debe ser una URL válida de Google Maps",
      (value) => !value || googleMapsRegex.test(value)
    ),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Datos enviados al backend:", formUpdate); // Verifica los datos
      const token = localStorage.getItem("token");
      const url = `${
        import.meta.env.VITE_URL_BACKEND
      }/actualizar/estudiante/${selectedEstudianteId}`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(url, formUpdate, options);
      console.log("datos de respuesta", response);
      if (response.data) {
        Swal.fire("Éxito", "Estudiante actualizado correctamente", "success");
        handleClose();
        RegistroDeListaEstudiantes(); // Actualiza la lista de estudiantes
      }
    } catch (error) {
      // Centraliza el manejo de errores
      const data = error.response?.data;
      let mensaje = "Ocurrió un error desconocido";
      if (data?.errors) {
        mensaje =
          "Errores de validación: " +
          data.errors.map((err) => err.msg).join(", ");
      } else if (data?.msg_actualizar_estudiantes) {
        mensaje = data.msg_actualizar_estudiantes;
      } else if (data?.msg) {
        mensaje = data.msg;
      }
      console.error("Error al actualizar:", error);
      Swal.fire("Error", mensaje, "error");
    }
  };

  const OpenMaps = (url) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      Swal.fire(
        "Sin ubicación",
        "No hay dirección de Google Maps registrada.",
        "info"
      );
    }
  };

  return (
    <>
      {/* Barra de búsqueda */}
      <Form
        className="d-flex justify-content-center mb-3"
        style={{ width: "100%" }}
        onSubmit={handleSearchSubmit} // Vincula la función al evento onSubmit
      >
        <Form.Control
          type="search"
          placeholder="Buscar estudiante por la cedula. Ejm: 1711171717"
          className="me-2"
          aria-label="Buscar"
          //Accion para la busqueda del estudiante por la cedula
          onChange={(e) => {
            const value = e.target.value;
            setCedula(value); // Actualizar el estado con lo que el usuario escribe

            // Si la barra de búsqueda está vacía, mostramos toda la lista
            if (!value) {
              RegistroDeListaEstudiantes(); // Llama a la función para cargar todos los estudiantes en la lista
            }
          }}
          style={{ maxWidth: "500px", width: "100%" }}
        />
        <Button
          variant="outline-success"
          style={{
            color: "#92BFF9",
            borderColor: "#92BFF9",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#92BFF9";
            e.target.style.color = "#fff";
            e.target.style.borderColor = "#92BFF9";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "#92BFF9";
            e.target.style.borderColor = "#92BFF9";
          }}
          onClick={BuscarEstuByDNA}
          type="submit"
        >
          BUSCAR
        </Button>
      </Form>

      {/* Mostrar mensaje de error si ocurre */}
      {error && (
        <Mensaje tipo={false} className="text-danger">
          {error}
        </Mensaje>
      )}

      {/* Mostrar mensaje si no hay estudiantes*/}
      {Array.isArray(estudiantes) && estudiantes.length === 0 && !error && (
        <Mensaje tipo={false}>{"No existen registros"}</Mensaje>
      )}

      {/* Tabla de los estudiantes registrados */}
      {Array.isArray(estudiantes) && estudiantes.length > 0 && (
        <Card className="shadow-lg rounded-lg border-0 mt-3">
          <Card.Body>
            <Table
              striped
              bordered
              hover
              responsive
              className="table-sm text-center w-100"
            >
              <thead>
                <tr style={{ backgroundColor: "#1f2833", color: "#ffffff" }}>
                  <th>N°</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Cédula</th>
                  <th>Nivel Escolar</th>
                  <th>Paralelo</th>
                  <th>Turno</th>
                  <th>Institución</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {/** Poner si solo se hace la lista sin la busqueda = {estudiantes.map((estudiantes, index) */}
                {estudiantesFiltrados.map((estudiantes, index) => (
                  <tr
                    style={{ backgroundColor: "#f8f9fa" }}
                    key={estudiantes._id}
                  >
                    <td>{index + 1}</td>
                    <td>{estudiantes.nombre}</td>
                    <td>{estudiantes.apellido}</td>
                    <td>{estudiantes.cedula}</td>
                    <td>{estudiantes.nivelEscolar}</td>
                    <td>{estudiantes.paralelo}</td>
                    <td>{estudiantes.turno}</td>
                    <td>{estudiantes.institucion}</td>

                    <td
                      className="d-flex justify-content-center align-items-center"
                      style={{ minWidth: "150px" }}
                    >
                      {auth.esReemplazo === "Sí" ? (
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="tooltip-maps">Abrir Ubicación</Tooltip>
                          }
                        >
                          <img
                            src={Maps}
                            alt="Maps"
                            style={{
                              height: "30px",
                              width: "30px",
                              marginRight: "7px",
                              cursor: "pointer",
                            }}
                            className="cursor-pointer inline-block icon-action"
                            onClick={() =>
                              OpenMaps(estudiantes.ubicacionDomicilio)
                            }
                          />
                        </OverlayTrigger>
                      ) : (
                        <>
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id="tooltip-actualizar">
                                Actualizar Información
                              </Tooltip>
                            }
                          >
                            <img
                              src={Update}
                              alt="Update"
                              style={{
                                height: "30px",
                                width: "30px",
                                marginRight: "7px",
                                cursor: "pointer",
                              }}
                              className="cursor-pointer inline-block icon-action"
                              onClick={() => handleShow(estudiantes)}
                            />
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id="tooltip-delete">Eliminar</Tooltip>
                            }
                          >
                            <img
                              src={Delete}
                              alt="Delete"
                              style={{
                                height: "30px",
                                width: "30px",
                                marginRight: "7px",
                                cursor: "pointer",
                              }}
                              className="cursor-pointer inline-block icon-action"
                              onClick={() => {
                                handleDelete(estudiantes._id);
                              }}
                            />
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id="tooltip-maps">
                                Abrir Ubicación
                              </Tooltip>
                            }
                          >
                            <img
                              src={Maps}
                              alt="Maps"
                              style={{
                                height: "30px",
                                width: "30px",
                                marginRight: "7px",
                                cursor: "pointer",
                              }}
                              className="cursor-pointer inline-block icon-action"
                              onClick={() =>
                                OpenMaps(estudiantes.ubicacionDomicilio)
                              }
                            />
                          </OverlayTrigger>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Modal para Actualizar Estudiantes */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Estudiantes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={formUpdate}
            enableReinitialize
            validationSchema={updateValidationSchema}
            onSubmit={async (values, actions) => {
              try {
                const token = localStorage.getItem("token");
                const url = `${
                  import.meta.env.VITE_URL_BACKEND
                }/actualizar/estudiante/${selectedEstudianteId}`;
                const options = {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                };
                const response = await axios.patch(url, values, options);
                if (response.data) {
                  Swal.fire(
                    "Éxito",
                    "Estudiante actualizado correctamente",
                    "success"
                  );
                  handleClose();
                  RegistroDeListaEstudiantes();
                }
              } catch (error) {
                const data = error.response?.data;
                let mensaje = "Ocurrió un error desconocido";
                if (data?.errors) {
                  mensaje =
                    "Errores de validación: " +
                    data.errors.map((err) => err.msg).join(", ");
                } else if (data?.msg_actualizar_estudiantes) {
                  mensaje = data.msg_actualizar_estudiantes;
                } else if (data?.msg) {
                  mensaje = data.msg;
                }
                Swal.fire("Error", mensaje, "error");
              }
              actions.setSubmitting(false);
            }}
          >
            {({ handleSubmit, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-2">
                  <Form.Label>Nivel Escolar</Form.Label>
                  <Field as={Form.Select} name="nivelEscolar">
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
                <Form.Group className="mb-2">
                  <Form.Label>Turno de Recorrido</Form.Label>
                  <Field as={Form.Select} name="turno">
                    <option value="">Seleccione un Formato</option>
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
                  <Form.Label>Direccion del Domicilio</Form.Label>
                  <Field
                    as={Form.Control}
                    type="url"
                    name="ubicacionDomicilio"
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
                <Modal.Footer>
                  <Button
                    variant="success"
                    style={{ backgroundColor: "#FF3737", border: "none" }}
                    onClick={handleClose}
                    type="button"
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="success"
                    style={{ backgroundColor: "#4CAF50", border: "none" }}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Guardar Cambios
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ListadeEstudiantes;
