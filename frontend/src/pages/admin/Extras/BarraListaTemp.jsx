import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Table } from "react-bootstrap";
import Mensaje from "../../../componets/Alertas/Mensaje";
import Delete from "../../../assets/borrar1.png";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import '../Styles-Admin/BarraListaTemp.css'

const BarraListaTemp = () => {
  const [conductores, setConductores] = useState([]);
  const [error, setError] = useState(null);

  //LOGICA PARA VISUALIZAR LA LISTA
  const ListaTemporal = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `${
        import.meta.env.VITE_URL_BACKEND
      }/listar/reemplazo/disponibles`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const respuesta = await axios.get(url, options);
      // Validamos que la respuesta contiene la propiedad "conductores" y es un arreglo
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
    } catch (err) {
      // Si el error es 400 y el mensaje es "No se han encontrado conductores de reemplazo"
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data?.msg_listar_conductores_reemplazo
      ) {
        setConductores([]); // Vacía la tabla
        setError(null); // No mostrar mensaje de error
      } else {
        console.error(err);
        setError(
          "Ocurrió un error al cargar los conductores. Intente nuevamente."
        );
      }
    }
  };

  useEffect(() => {
    ListaTemporal();
    // Escuchar el evento personalizado para recargar la lista dirigido para la lista de conductor temporal
    const handler = () => ListaTemporal();
    window.addEventListener("recargar-lista-temporal", handler);
    // Limpieza al desmontar
    return () => window.removeEventListener("recargar-lista-temporal", handler);
  }, []);

  //LOGICA PARA ELIMINAR CONDUCTOR
  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Vas a eliminar a un conductor Temporal.",
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
        }/eliminar/reemplazos/disponible/${id}`;
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        await axios.delete(url, { headers });
        // Espera 500ms antes de recargar la lista
        setTimeout(() => {
          ListaTemporal();
        }, 500);
        // Mostrar alerta de éxito
        await Swal.fire({
          title: "Eliminado",
          text: "El conductor temporal ha sido eliminado correctamente del sistema.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.msg_eliminar_reemplazo ||
          "Ocurrió un error al eliminar el conductor temporal."
      );
    }
  };

  return (
    <>
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
                          handleDelete(conductor._id);
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
    </>
  );
};

export default BarraListaTemp;
