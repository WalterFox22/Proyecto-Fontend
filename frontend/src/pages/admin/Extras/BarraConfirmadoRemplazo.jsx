import axios from "axios";
import { useEffect, useState } from "react";
import Mensaje from "../../../componets/Alertas/Mensaje";
import { Card, Table } from "react-bootstrap";

const BarraConfirmadoRemplazo = () => {
  const [conductores, setConductores] = useState([]);
  const [error, setError] = useState(null);

  const ListaConductoresRemplazados = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_URL_BACKEND}/listar/conductores/conreemplazo`;
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
                        src={Delete}
                        alt="Delete"
                        style={{
                          height: "30px",
                          width: "30px",
                          marginRight: "7px",
                          cursor: "pointer",
                        }}
                        className="cursor-pointer inline-block"
                        /** 
                                    onClick={() => {
                                      handleDelete(conductor._id);
                                    }}
                                      */
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

export default BarraConfirmadoRemplazo;
