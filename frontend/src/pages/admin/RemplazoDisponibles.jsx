import { useEffect, useState } from "react";
import Mensaje from "../../componets/Alertas/Mensaje";
import { Button, Card, Modal, Table } from "react-bootstrap";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

const RemplazoDisponible = () => {
  const [conductores, setConductores] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  //Logica para obtener el id selccionado para los remplazos
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const idPrincipal = query.get("idPrincipal");

  // Estados para los modals
  const [showTipo, setShowTipo] = useState(false);
  const [showPermanente, setShowPermanente] = useState(false);
  const [showTemporal, setShowTemporal] = useState(false);

  // Puedes guardar el conductor seleccionado si lo necesitas
  const [conductorSeleccionado, setConductorSeleccionado] = useState(null);

  // Logica para obtener la lista de los conductores temporales
  const ListaDisponible = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_URL_BACKEND}/listar/reemplazo/disponibles`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const respuesta = await axios.get(url, options);
      if (
        respuesta.data &&
        Array.isArray(respuesta.data.reemplazosDisponibles)
      ) {
        setConductores(respuesta.data.reemplazosDisponibles);
      } else {
        throw new Error(
          "La respuesta del servidor no contiene un arreglo de conductores"
        );
      }
    } catch (error) {
      console.log(error);
      setError(
        "Ocurrió un error al cargar los conductores. Intente nuevamente."
      );
    }
  };

  useEffect(() => {
    ListaDisponible();
  }, []);

  // Función para abrir el modal de tipo de reemplazo
  const handleSeleccionar = (conductor) => {
    setConductorSeleccionado(conductor);
    setShowTipo(true);
  };

  // Logica para asignar un conductor temporal
  const ConductorTemp = async () => {
    if (!conductorSeleccionado || !idPrincipal) {
      setError(
        "No se ha seleccionado un conductor o falta el ID del conductor original."
      );
      return;
    }
    try {
      const token = localStorage.getItem("token");
      // Reemplaza los parámetros en la URL
      const url = `${import.meta.env.VITE_URL_BACKEND}/reemplazo/temporal/${idPrincipal}/${conductorSeleccionado._id}`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.patch(url, {}, options);
      setShowTemporal(false);
      // Puedes mostrar un mensaje de éxito aquí
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Reemplazo  temporal realizado con éxito.",
        confirmButtonText: "Aceptar",
      }).then(() => {
        navigate("/dashboard/listar/conductores/temporales"); // Redirige al login después de aceptar
      });
      // Recargar la lista de conductores disponibles
      ListaDisponible();
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.msg_reemplazo || "Ocurrió un error al realizar el reemplazo temporal."
      );
    }
  };

  // Logica de remplazar para conductor Permanente
  const PermanentConductor = async () => {
    if (!conductorSeleccionado || !idPrincipal) {
      setError(
        "No se ha seleccionado un conductor o falta el ID del conductor original."
      );
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_URL_BACKEND}/reemplazo/permanente/${idPrincipal}/${conductorSeleccionado._id}`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.patch(url, {}, options);
      setShowTemporal(false);
      // Puedes mostrar un mensaje de éxito aquí
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Reemplazo Permanente realizado con éxito.",
        confirmButtonText: "Aceptar",
      }).then(() => {
        navigate("/dashboard/listar/conductores");
      });
      // Recargar la lista de conductores disponibles
      ListaDisponible();
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.msg_reemplazo || "Ocurrió un error al realizar el reemplazo Permanente."
      );
    }
  };

  return (
    <>
      <ToastContainer />
      {/* Encabezado */}
      <div className="text-center mb-0">
        <h1>Lista de Conductores Reemplazo</h1>
        <hr />
        <p className="mb-1">
          Este módulo te permite seleccionar un conductor para realizar un reemplazo.
        </p>
      </div>
      {error && (
        <Mensaje tipo={false} className="text-danger">
          {error}
        </Mensaje>
      )}
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
                  <th>Placa Vehicular</th>
                  <th>Cooperativa</th>
                  <th>Correo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {conductores.map((conductor, index) => (
                  <tr
                    style={{ backgroundColor: "#f8f9fa" }}
                    key={conductor._id}
                  >
                    <td>{index + 1}</td>
                    <td>{conductor.nombre}</td>
                    <td>{conductor.apellido}</td>
                    <td>{conductor.cedula}</td>
                    <td>{conductor.placaAutomovil}</td>
                    <td>{conductor.cooperativa}</td>
                    <td>{conductor.email}</td>

                    <td
                      className="d-flex justify-content-center align-items-center"
                      style={{ minWidth: "150px" }}
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSeleccionar(conductor)}
                      >
                        Seleccionar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Modal 1: Seleccione el tipo de rol de reemplazo */}
      <Modal
        show={showTipo}
        onHide={() => setShowTipo(false)}
        animation={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Seleccione el tipo de rol de reemplazo</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="d-flex justify-content-center gap-2">
            <Button
              variant="warning"
              size="sm"
              className="fs-6 text-capitalize"
              onClick={() => {
                setShowTipo(false);
                setShowTemporal(true);
              }}
            >
              Reemplazo temporal
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="fs-6 text-capitalize"
              onClick={() => {
                setShowTipo(false);
                setShowPermanente(true);
              }}
            >
              Reemplazo permanente
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal 2: Reemplazo permanente */}
      <Modal
        show={showPermanente}
        onHide={() => setShowPermanente(false)}
        animation={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            ¿Estás seguro de que se elimine a un conductor y reemplazar con
            otro?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Button
            variant="success"
            className="me-2"
            onClick={PermanentConductor}
          >
            Aceptar
          </Button>
          <Button variant="secondary" onClick={() => setShowPermanente(false)}>
            Cancelar
          </Button>
        </Modal.Body>
      </Modal>

      {/* Modal 3: Reemplazo temporal */}
      <Modal
        show={showTemporal}
        onHide={() => setShowTemporal(false)}
        animation={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            ¿Estás seguro de comenzar el reemplazo temporal?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Button variant="success" className="me-2" onClick={ConductorTemp}>
            Aceptar
          </Button>
          <Button variant="secondary" onClick={() => setShowTemporal(false)}>
            Cancelar
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RemplazoDisponible;
