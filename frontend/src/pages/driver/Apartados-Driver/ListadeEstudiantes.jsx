import { useContext, useEffect, useState } from "react";
import Mensaje from "../../../componets/Alertas/Mensaje";
import { Button, Card, Form, Modal, Table } from "react-bootstrap";
import Delete from "../../../assets/borrar1.png";
import Update from "../../../assets/actualizar.png";
import Swal from "sweetalert2";
import AuthContext from "../../../context/AuthProvider";
import axios from "axios";

const ListadeEstudiantes = () => {
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
      setEstudiantes(respuesta.data.estudiantes);
    } catch (error) {
      console.log(error);
      setError(
        "Ocurrió un error al cargar los estudiantes. Intente nuevamente."
      );
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

        // Mostrar alerta de éxito
        Swal.fire({
          title: "Eliminado",
          text: "El estudiante ha sido eliminado correctamente de la ruta y del sistema.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
        //Actualiza la tabla con los cambios realizados
        RegistroDeListaEstudiantes();
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
  const estudiantesFiltrados = estudiantes.filter((estudiantes) =>
    String(estudiantes.cedula).toLowerCase().includes(cedula.toLowerCase())
  );

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
    nombre: "",
    apellido: "",
    nivelEscolar: "",
    genero: "",
    paralelo: "",
    cedula: "",
    ubicacionDomicilio: "",
    recoCompletoOMedio: "",
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
      nombre: estudiante.nombre || "",
      apellido: estudiante.apellido || "",
      nivelEscolar: estudiante.nivelEscolar || "",
      genero: estudiante.genero || "",
      paralelo: estudiante.paralelo || "",
      cedula: estudiante.cedula || "",
      ubicacionDomicilio: estudiante.ubicacionDomicilio || "",
      recoCompletoOMedio: estudiante.recoCompletoOMedio || "",
    });
    setSelectedEstudianteId(estudiante._id); // Guardar el ID del estudiante seleccionado
    setShow(true); // Abrir el modal
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Datos enviados al backend:", formUpdate); // Verifica los datos
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_URL_BACKEND}/actualizar/estudiante/${selectedEstudianteId}`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(url, formUpdate, options);
      console.log("datos de respuesta", response)
      if (response.data) {
        Swal.fire("Éxito", "Estudiante actualizado correctamente", "success");
        handleClose();
        RegistroDeListaEstudiantes(); // Actualiza la lista de estudiantes
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        console.error("Errores de validación:", error.response.data.errors);
        Swal.fire("Error", "Errores de validación: " + error.response.data.errors.map(err => err.msg).join(", "), "error");
      } else {
        console.error("Error desconocido:", error);
        Swal.fire("Error", "Ocurrió un error desconocido", "error");
      }
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
      {estudiantes.length === 0 && !error && (
        <Mensaje tipo={false}>{"No existen registros"}</Mensaje>
      )}

      {/* Tabla de los estudiantes registrados */}
      {estudiantes.length > 0 && (
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
                  <th>Nivel Escolar</th>
                  <th>Paralelo</th>
                  <th>Recorrido</th>
                  <th>Institucion</th>
                  <th>Cedula</th>
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
                    <td>{estudiantes.nivelEscolar}</td>
                    <td>{estudiantes.paralelo}</td>
                    <td>{estudiantes.recoCompletoOMedio}</td>
                    <td>{estudiantes.institucion}</td>
                    <td>{estudiantes.cedula}</td>

                    <td
                      className="d-flex justify-content-center align-items-center"
                      style={{ minWidth: "150px" }}
                    >
                      <img
                        src={Update}
                        alt="Update"
                        style={{
                          height: "20px",
                          width: "20px",
                          marginRight: "7px",
                          cursor: "pointer",
                        }}
                        className="cursor-pointer inline-block"
                        onClick={() => handleShow(estudiantes)}
                      />

                      <img
                        src={Delete}
                        alt="Delete"
                        style={{
                          height: "20px",
                          width: "20px",
                          marginRight: "7px",
                          cursor: "pointer",
                        }}
                        className="cursor-pointer inline-block"
                        onClick={() => {
                          handleDelete(estudiantes._id);
                        }}
                      />
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
          {/* Asegúrate de que el formulario envuelve correctamente los elementos */}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formUpdate.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                value={formUpdate.apellido}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Genero</Form.Label>
              <Form.Select
                as="select"
                name="genero"
                value={formUpdate.genero}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un género</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Prefiero no decirlo">Prefiero no decirlo</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Cedula</Form.Label>
              <Form.Control
                type="text"
                name="cedula"
                value={formUpdate.cedula}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Nivel Escolar</Form.Label>
              <Form.Select
                name="nivelEscolar"
                value={formUpdate.nivelEscolar}
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
                value={formUpdate.paralelo}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un paralelo</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Formato de Recorrido</Form.Label>
              <Form.Select
                name="recoCompletoOMedio"
                value={formUpdate.recoCompletoOMedio}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un Formato</option>
                <option value="Completo">Completo</option>
                <option value="Medio">Medio</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Direccion del Domicilio</Form.Label>
              <Form.Control
                type="url"
                name="ubicacionDomicilio"
                value={formUpdate.ubicacionDomicilio}
                onChange={handleChange}
                required
              />
              <Form.Text className="text-muted">
                Ejemplo: https://maps.google.com/Direccion
              </Form.Text>
            </Form.Group>

            {/* Botones dentro del formulario */}
            <Modal.Footer>
              <Button
                variant="success"
                style={{ backgroundColor: "#FF3737", border: "none" }}
                onClick={handleClose}
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
    </>
  );
};

export default ListadeEstudiantes;
