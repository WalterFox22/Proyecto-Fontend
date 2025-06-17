import React, { useContext, useEffect, useState } from "react";
import { Table, Card, Form, Button, Modal } from "react-bootstrap";
import Delete from "../assets/borrar1.png";
import Update from "../assets/actualizar.png";
import AddAdmin from "../assets/admin-replace.png";
import Replace from "../assets/remplazo.png";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Mensaje from "./Alertas/Mensaje";
import { toast, ToastContainer } from "react-toastify";
import AuthContext from "../context/AuthProvider";
import * as Yup from "yup";
import "../pages/admin/Styles-Admin/BarraListar.css";

const onlyLetters = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
const placaRegex = /^[A-Z]{3}-\d{4}$/;

const perfilSchema = Yup.object({
  nombre: Yup.string()
    .matches(onlyLetters, "Solo se permiten letras")
    .notRequired(),
  apellido: Yup.string()
    .matches(onlyLetters, "Solo se permiten letras")
    .notRequired(),
  cedula: Yup.string()
    .matches(/^\d{10}$/, "La cédula debe tener 10 dígitos")
    .notRequired(),
  cooperativa: Yup.string()
    .matches(onlyLetters, "Solo se permiten letras")
    .notRequired(),
  placaAutomovil: Yup.string()
    .matches(placaRegex, "Formato de placa inválido. Ejemplo: PRT-9888")
    .notRequired(),
  rutaAsignada: Yup.string()
    .matches(/^(1[0-2]|[1-9])$/, "Solo hay rutas del 1 al 12")
    .notRequired(),
  sectoresRuta: Yup.string()
    .matches(onlyLetters, "Solo se permiten letras")
    .notRequired(),
});

const BarraListar = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [conductores, setConductores] = useState([]);
  const [rutaAsignada, setRutaAsignada] = useState(""); // Ruta que se ingresa para búsqueda
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // para la seccion del modal
  const [conductorIdActualizar, setConductorIdActualizar] = useState(null); // para el apartado de actualizar conductor

  // Efecto para borrar el error cuando cambia la ruta asignada
  useEffect(() => {
    setError(null); // Esto borra el mensaje de error cuando se empieza a escribir
  }, [rutaAsignada]);

  // Función para listar conductores desde el backend
  const listarConductores = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_URL_BACKEND}/listar/conductores`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const respuesta = await axios.get(url, options);

      // Validamos que la respuesta contiene la propiedad "conductores" y es un arreglo
      if (respuesta.data && Array.isArray(respuesta.data.listar_conductores)) {
        setConductores(respuesta.data.listar_conductores);
      } else {
        throw new Error(
          "La respuesta del servidor no contiene un arreglo de conductores"
        );
      }
    } catch (err) {
      console.error(err);
      setError(
        "Ocurrió un error al cargar los conductores. Intente nuevamente."
      );
    }
  };

  // Buscar conductor por la ruta ingresada
  const buscarConductorPorRuta = async () => {
    // Reseteamos el error antes de hacer la búsqueda
    setError(null);

    if (!rutaAsignada) {
      // Si el campo de búsqueda está vacío, recargamos toda la lista de conductores
      listarConductores(); // Recarga todos los conductores
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = `${
        import.meta.env.VITE_URL_BACKEND
      }/buscar/conductor/ruta/${rutaAsignada}`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const respuesta = await axios.get(url, options);

      if (respuesta.data && respuesta.data.conductor) {
        setConductores(
          Array.isArray(respuesta.data.conductor)
            ? respuesta.data.conductor
            : [respuesta.data.conductor]
        );
      } else {
        setConductores([]);
        setError("No se encontraron conductores para la ruta especificada");
      }
    } catch (err) {
      console.error(err);
      setError("Error al buscar el conductor. Intente nuevamente.");
    }
  };

  // Filtrar los conductores solo por la ruta asignada
  const conductoresFiltrados = Array.isArray(conductores)
    ? conductores.filter((conductor) =>
        String(conductor.rutaAsignada)
          .toLowerCase()
          .includes(rutaAsignada.toLowerCase())
      )
    : [conductores].filter((conductor) =>
        String(conductor.rutaAsignada)
          .toLowerCase()
          .includes(rutaAsignada.toLowerCase())
      );

  // Borrar Conductor de la base de datos
  /* 
  const handleDelete = async (id) => {
    try {
      // Alerta de enviar antes de eliminar para evitar errores
      // Mostrar alerta de confirmación
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Vas a eliminar a un conductor. Si lo eliminas, debes registrar otro de inmediato.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });

      // Si el usuario confirma, eliminar conductor
      if (result.isConfirmed) {
        // definicion del token
        const token = localStorage.getItem("token");
        // establecer la ruta de acceso al backend
        const url = `${
          import.meta.env.VITE_URL_BACKEND
        }/eliminar/conductor/${id}`;
        // Enviamos la solicitud al backend definicion de objeto para los headers
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        // recibimos la respuesta del backend
        await axios.delete(url, { headers });

        // Mostrar alerta de éxito
        Swal.fire({
          title: "Eliminado",
          text: "El conductor ha sido eliminado correctamente. Recuerda registrar a un nuevo conductor de manera URGENTE!!",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
        navigate("/dashboard/registro/conductores");
        //listarConductores()
      }
    } catch (error) {
      console.log(error);
    }
  };
  */

  // Función para manejar el cambio en la barra de búsqueda
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setRutaAsignada(value);

    if (!value) {
      // Si la barra de búsqueda está vacía, recargar toda la lista de conductores
      listarConductores();
    }
  };

  // Función para manejar la búsqueda cuando presionas "Enter"
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevenir la acción por defecto del formulario

    if (!rutaAsignada) {
      // Si la barra de búsqueda está vacía, recargar toda la lista de conductores
      listarConductores();
    } else {
      buscarConductorPorRuta(); // Realizar la búsqueda con la ruta especificada
    }
  };

  // Efecto para cargar los conductores al montar el componente
  useEffect(() => {
    listarConductores();
  }, []);

  // LOGICA DE ACTUALIZAR CONDUCTOR
  const [formPerfil, setFormPerfil] = useState({
    rutaAsignada: "",
    sectoresRuta: "",
    nombre: "",
    apellido: "",
    cooperativa: "",
    cedula: "",
    placaAutomovil: "",
  });

  // Abrir modal y cargar datos del conductor seleccionado
  const handleOpenModal = (conductor) => {
    setFormPerfil({
      rutaAsignada: conductor.rutaAsignada || "",
      sectoresRuta: conductor.sectoresRuta || "",
      nombre: conductor.nombre || "",
      apellido: conductor.apellido || "",
      cooperativa: conductor.cooperativa || "",
      cedula: conductor.cedula || "",
      placaAutomovil: conductor.placaAutomovil || "",
    });
    setConductorIdActualizar(conductor._id);
    setShowModal(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setFormPerfil({
      rutaAsignada: "",
      sectoresRuta: "",
      nombre: "",
      apellido: "",
      cooperativa: "",
      cedula: "",
      placaAutomovil: "",
    });
    setConductorIdActualizar(null);
  };

  // Manejar cambios en el formulario
  const handleChangePerfil = (e) => {
    setFormPerfil({
      ...formPerfil,
      [e.target.name]: e.target.value,
    });
  };

  const [formErrors, setFormErrors] = useState({});

  // Validar antes de enviar
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await perfilSchema.validate(formPerfil, { abortEarly: false });
      setFormErrors({});
      // ...tu código de actualización...
      const token = localStorage.getItem("token");
      const url = `${
        import.meta.env.VITE_URL_BACKEND
      }/actualizar/conductor/${conductorIdActualizar}`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const respuesta = await axios.patch(url, formPerfil, options);

      Swal.fire({
        title: "Actualizado",
        text:
          respuesta.data.msg_actualizacion_conductor ||
          "Conductor actualizado correctamente.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      handleCloseModal();
      listarConductores();
    } catch (error) {
      if (error.name === "ValidationError") {
        // Formatea los errores de Yup
        const errors = {};
        error.inner.forEach((err) => {
          errors[err.path] = err.message;
        });
        setFormErrors(errors);
      } else {
        toast.error(
          error?.response?.data?.msg_actualizacion_conductor ||
            "Error al actualizar el conductor."
        );
      }
    }
  };

  // ASIGNAR PRIVILEGIOS DE ADMINISTRADOR
  const handleAddAdmin = async (id) => {
    try {
      let eliminacionAdminSaliente = undefined;
      let confirmResult = null;

      if (auth.esConductor === "No") {
        confirmResult = await Swal.fire({
          title: "¿Estás seguro?",
          text: "Vas a asignar los privilegios de Administrador al conductor seleccionado.\nEscoja una opción:",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, asignar privilegios",
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          input: "radio",
          inputOptions: {
            Sí: "Eliminar información del admin saliente",
            No: "Mantener información del admin saliente",
          },
          inputValidator: (value) => {
            if (!value) {
              return "Debes seleccionar una opción";
            }
          },
        });
        eliminacionAdminSaliente = confirmResult.value;
        if (!eliminacionAdminSaliente) {
          // Si no seleccionó opción, no continuar
          return;
        }
      } else if (auth.esConductor === "Sí") {
        confirmResult = await Swal.fire({
          title: "¿Estás seguro?",
          text: "Vas a asignar los privilegios de Administrador al conductor seleccionado.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, asignar privilegios",
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
        });
      }

      if (confirmResult.isConfirmed) {
        const token = localStorage.getItem("token");
        const url = `${
          import.meta.env.VITE_URL_BACKEND
        }/asignar/privilegios/admin/${id}`;
        const options = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        // Siempre enviar un objeto, aunque esté vacío
        const body =
          eliminacionAdminSaliente !== undefined
            ? { eliminacionAdminSaliente }
            : {};

        // Log para depuración
        console.log("Enviando PATCH a:", url);
        console.log("Body:", body);

        const respuesta = await axios.patch(url, body, options);

        Swal.fire({
          title: "Éxito",
          text: respuesta.data.msg || "Privilegios asignados correctamente.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        }).then(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("rol");
          navigate("/login");
        });
      }
    } catch (error) {
      // Mostrar mensaje exacto del backend si existe
      const msg =
        error?.response?.data?.msg_actualizacion_conductor ||
        error?.response?.data?.msg ||
        "Error al asignar privilegios de administrador.";
      toast.error(msg);

      // Log para depuración
      console.error("Error al asignar admin:", error?.response?.data || error);
    }
  };

  return (
    <>
      <ToastContainer />
      {/* Barra de búsqueda */}
      <Form
        className="d-flex justify-content-center mb-3"
        onSubmit={handleSearchSubmit}
        style={{ width: "100%" }}
      >
        <Form.Control
          type="search"
          placeholder="Buscar Conductor por ruta. Ejm: 11"
          className="me-2"
          aria-label="Buscar"
          value={rutaAsignada}
          onChange={(e) => {
            const value = e.target.value;
            setRutaAsignada(value); // Actualizar el estado con lo que el usuario escribe

            // Si la barra de búsqueda está vacía, mostramos toda la lista
            if (!value) {
              setError(null);
              listarConductores(); // Llama a la función para cargar todos los conductores
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
          onClick={buscarConductorPorRuta}
          type="submit"
        >
          {" "}
          {/** SE INVOCA ACA LA FUNCION BUCAR Y NO EN EL USEEFFECT */}
          BUSCAR
        </Button>
      </Form>

      {/* Mostrar mensaje de error si ocurre */}
      {error && (
        <Mensaje tipo={false} className="text-danger">
          {error}
        </Mensaje>
      )}

      {/* Mostrar mensaje si no hay conductores */}
      {conductores.length === 0 && !error && (
        <Mensaje tipo={false}>{"No existen registros"}</Mensaje>
      )}

      {/* Tabla de conductores */}
      {conductores.length > 0 && (
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
                  <th>Ruta</th>
                  <th>Sector</th>
                  <th>Placa Vehicular</th>
                  <th>Cooperativa</th>
                  <th>Correo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {conductoresFiltrados.map((conductor, index) => (
                  <tr
                    style={{ backgroundColor: "#f8f9fa" }}
                    key={conductor._id}
                  >
                    <td>{index + 1}</td>
                    <td>{conductor.nombre}</td>
                    <td>{conductor.apellido}</td>
                    <td>{conductor.cedula}</td>
                    <td>{conductor.rutaAsignada}</td>
                    <td>{conductor.sectoresRuta}</td>
                    <td>{conductor.placaAutomovil}</td>
                    <td>{conductor.cooperativa}</td>
                    <td>{conductor.email}</td>

                    <td
                      className="d-flex justify-content-center align-items-center"
                      style={{ minWidth: "150px" }}
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
                        onClick={() => {
                          handleOpenModal(conductor);
                        }}
                      />
                      {/** 
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
                          handleDelete(conductor._id);
                        }}
                      />
                      */}
                      <img
                        src={AddAdmin}
                        alt="AddAdmin"
                        style={{
                          height: "30px",
                          width: "30px",
                          marginRight: "7px",
                          cursor: "pointer",
                        }}
                        className="cursor-pointer inline-block icon-action"
                        onClick={() => {
                          handleAddAdmin(conductor._id);
                        }}
                      />
                      <img
                        src={Replace}
                        alt="Replace"
                        style={{
                          height: "30px",
                          width: "30px",
                          marginRight: "7px",
                          cursor: "pointer",
                        }}
                        className="cursor-pointer inline-block icon-action"
                        onClick={() =>
                          navigate(
                            `/dashboard/listar/reemplazo/disponibles?idPrincipal=${conductor._id}`
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Modal solo para actualizar rutaAsignada y sectoresRuta */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Información</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdate}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formPerfil.nombre}
                onChange={handleChangePerfil}
                isInvalid={!!formErrors.nombre}
              />
              <Form.Control.Feedback
                type="invalid"
                style={{ color: "#e74c3c", fontSize: "0.95em" }}
              >
                {formErrors.nombre}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="apellido">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                value={formPerfil.apellido}
                onChange={handleChangePerfil}
                isInvalid={!!formErrors.apellido}
              />
              <Form.Control.Feedback
                type="invalid"
                style={{ color: "#e74c3c", fontSize: "0.95em" }}
              >
                {formErrors.apellido}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="cedula">
              <Form.Label>Cédula</Form.Label>
              <Form.Control
                type="text"
                name="cedula"
                value={formPerfil.cedula}
                onChange={handleChangePerfil}
                isInvalid={!!formErrors.cedula}
              />
              <Form.Control.Feedback
                type="invalid"
                style={{ color: "#e74c3c", fontSize: "0.95em" }}
              >
                {formErrors.cedula}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="cooperativa">
              <Form.Label>Cooperativa</Form.Label>
              <Form.Control
                type="text"
                name="cooperativa"
                value={formPerfil.cooperativa}
                onChange={handleChangePerfil}
                isInvalid={!!formErrors.cooperativa}
              />
              <Form.Control.Feedback
                type="invalid"
                style={{ color: "#e74c3c", fontSize: "0.95em" }}
              >
                {formErrors.cooperativa}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="placaAutomovil">
              <Form.Label>Placa del Automóvil</Form.Label>
              <Form.Control
                type="text"
                name="placaAutomovil"
                value={formPerfil.placaAutomovil}
                onChange={handleChangePerfil}
                isInvalid={!!formErrors.placaAutomovil}
              />
              <Form.Control.Feedback
                type="invalid"
                style={{ color: "#e74c3c", fontSize: "0.95em" }}
              >
                {formErrors.placaAutomovil}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="rutaAsignada">
              <Form.Label>Ruta de Transporte</Form.Label>
              <Form.Control
                type="text"
                name="rutaAsignada"
                value={formPerfil.rutaAsignada}
                onChange={handleChangePerfil}
                isInvalid={!!formErrors.rutaAsignada}
              />
              <Form.Control.Feedback
                type="invalid"
                style={{ color: "#e74c3c", fontSize: "0.95em" }}
              >
                {formErrors.rutaAsignada}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="sectoresRuta">
              <Form.Label>Sector designado</Form.Label>
              <Form.Control
                type="text"
                name="sectoresRuta"
                value={formPerfil.sectoresRuta}
                onChange={handleChangePerfil}
                isInvalid={!!formErrors.sectoresRuta}
              />
              <Form.Control.Feedback
                type="invalid"
                style={{ color: "#e74c3c", fontSize: "0.95em" }}
              >
                {formErrors.sectoresRuta}
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="success" type="submit">
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* MODAL PARA ASIGNAR PRIVILEGIOS DE ADMIN */}
    </>
  );
};

export default BarraListar;
