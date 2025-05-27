import axios from "axios";
import { useEffect, useState } from "react";
import Mensaje from "../../../componets/Alertas/Mensaje";
import { Card, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const BarraConfirmadoRemplazo = () => {
  const [conductores, setConductores] = useState([]);
  const [error, setError] = useState(null);

  const ListaConductoresRemplazados = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `${
        import.meta.env.VITE_URL_BACKEND
      }/listar/conductores/conreemplazo`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const respuesta = await axios.get(url, options);

      if (
        respuesta.data &&
        Array.isArray(respuesta.data.conductoresConReemplazo)
      ) {
        setConductores(respuesta.data.conductoresConReemplazo);
        setError(null);
      } else {
        setConductores([]);
        setError(respuesta.data.msg || "No existen registros");
      }
    } catch (error) {
      setConductores([]);
      setError(
        error.response?.data?.msg ||
          "Ocurrió un error al cargar los conductores. Intente nuevamente."
      );
    }
  };

  useEffect(() => {
    ListaConductoresRemplazados();
  }, []);

  // Logica de activar al conductor original
  const handleActivarDriver = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const url = `${
        import.meta.env.VITE_URL_BACKEND
      }/activar/conductor/original/${id}`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const respuesta = await axios.patch(url, {}, options);
      // Mostrar mensaje de éxito si la activación fue correcta
      if (respuesta.data && respuesta.data.msg_reemplazo) {
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Se a activado el conductor principal exitosamente.",
          confirmButtonText: "Aceptar",
        });
        // Recargar la lista de conductores para reflejar el cambio
        ListaConductoresRemplazados();
        // Dispara el evento para recargar la lista temporal en BarraListaTemp.jsx
        window.dispatchEvent(new Event("recargar-lista-temporal"));
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.msg_activacion_conductor || "Ocurrió un error al realizar la activación del conductor original."
      );
    }
  };

  return (
    <>
      <div className="text-center mb-4 mt-5">
        <h1>Conductores con remplazos</h1>
        <hr />
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
                  <th>Ruta</th>
                  <th>Sector</th>
                  <th>Placa Vehicular</th>
                  <th>Cooperativa</th>
                  <th>Remplazo</th>
                  <th>Cédula</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {conductores.map((item, index) => (
                  <tr
                    style={{ backgroundColor: "#f8f9fa" }}
                    key={item.conductorOriginal._id}
                  >
                    <td>{index + 1}</td>
                    <td>{item.conductorOriginal.nombre}</td>
                    <td>{item.conductorOriginal.apellido}</td>
                    <td>{item.conductorOriginal.cedula}</td>
                    <td>{item.conductorOriginal.rutaAsignada}</td>
                    <td>{item.conductorOriginal.sectoresRuta}</td>
                    <td>{item.conductorOriginal.placaAutomovil}</td>
                    <td>{item.conductorOriginal.cooperativa}</td>
                    <td>
                      {/* Informacion del remplazo */}
                      {item.reemplazo
                        ? `${item.reemplazo.nombre} ${item.reemplazo.apellido}`
                        : "Sin reemplazo"}
                    </td>
                    <td>{item.conductorOriginal.cedula}</td>
                    <td
                      className="d-flex justify-content-center align-items-center"
                      style={{ minWidth: "150px" }}
                    >
                      <button
                        className="btn btn-success btn-sm"
                        style={{ fontSize: "0.9rem", padding: "4px 12px" }}
                        onClick={() =>
                          handleActivarDriver(item.conductorOriginal._id)
                        } // Puedes agregar tu función aquí
                      >
                        Activar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default BarraConfirmadoRemplazo;
