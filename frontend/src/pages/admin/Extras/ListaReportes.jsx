import axios from "axios";
import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Card,
} from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Mensaje from "../../../componets/Alertas/Mensaje";

ChartJS.register(ArcElement, Tooltip, Legend);

const ListaReportes = () => {
  const opcionesReporte = [
    { value: "Reemplazo temporal", label: "Reemplazos Temporales" },
    { value: "Reemplazo permanente", label: "Reemplazos Permanentes" },
    {
      value: "Activación de conductores originales",
      label: "Activaciones de Conductores Originales",
    },
    { value: "Reemplazo Activos", label: "Reemplazos Activos" },
    {
      value: "Listado de estudiantes de un conductor",
      label: "Listado de Estudiantes por Ruta",
    },
  ];

  const [cantidades, setCantidades] = useState(null);
  const [loadingCantidades, setLoadingCantidades] = useState(true);
  const [opcion, setOpcion] = useState("");
  const [detalle, setDetalle] = useState([]);
  const [detalleError, setDetalleError] = useState(null);
  const [busquedaRuta, setBusquedaRuta] = useState("");
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  const ReporteTablas = async () => {
    setLoadingDetalle(true);
    setDetalle([]);
    setDetalleError(null);
    try {
      const token = localStorage.getItem("token");
      const url = `${
        import.meta.env.VITE_URL_BACKEND
      }/info/completa/reemplazos`;
      let body = { informacionHaVisualizar: opcion };
      if (opcion === "Listado de estudiantes de un conductor") {
        if (!busquedaRuta) {
          setDetalleError("Debes ingresar la ruta a buscar.");
          setLoadingDetalle(false);
          return;
        }
        body.rutaABuscar = busquedaRuta;
      }
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const respuesta = await axios.post(url, body, options);
      // Determinar qué propiedad contiene la data
      if (opcion === "Reemplazo temporal")
        setDetalle(respuesta.data.infoReemplazosTemporales || []);
      else if (opcion === "Reemplazo permanente")
        setDetalle(respuesta.data.infoReemplazosPermanentes || []);
      else if (opcion === "Activación de conductores originales")
        setDetalle(respuesta.data.infoActivacion || []);
      else if (opcion === "Reemplazo Activos")
        setDetalle(respuesta.data.infoReemplazosActivos || []);
      else if (opcion === "Listado de estudiantes de un conductor")
        setDetalle(respuesta.data.infoEstudiantes || []);
      setDetalleError(null);
    } catch (error) {
      setDetalle([]);
      setDetalleError(
        error.response?.data?.msg_historial_reemplazo ||
          "No se pudo obtener la información del reporte."
      );
      console.log(error);
    } finally {
      setLoadingDetalle(false);
    }
  };

  const ReportesNumeroGenerales = async () => {
    setLoadingCantidades(true);
    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_URL_BACKEND}/info/cantidades`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const respuesta = await axios.get(url, options);
      setCantidades(respuesta.data);
    } catch (error) {
      console.log(error);
      setCantidades(null);
    } finally {
      setLoadingCantidades(false);
    }
  };

  useEffect(() => {
    ReportesNumeroGenerales();
  }, []);

  // Manejar selección de reporte
  const handleSelect = (e) => {
    setOpcion(e.target.value);
    setDetalle([]);
    setDetalleError(null);
    setBusquedaRuta("");
  };

  // Datos para Doughnut Chart.js
  const chartData = cantidades
    ? {
        labels: [
          "Reemplazos Activos",
          "Reemplazos Terminados",
          "Reemplazos Temporales",
          "Reemplazos Permanentes",
          "Estudiantes Mañana",
          "Estudiantes Tarde",
          "Estudiantes Completo",
        ],
        datasets: [
          {
            label: "Cantidad",
            backgroundColor: [
              "#008080",
              "#560C23",
              "#FF9900",
              "#32CD32",
              "#4CAF50",
              "#FF3737",
              "#1f2833",
            ],
            data: [
              cantidades.reemplazoActivo,
              cantidades.reemplazoTerminado,
              cantidades.reemplazosTemporales,
              cantidades.reemplazosPermanentes,
              cantidades.estudiantesRegistradosMañana,
              cantidades.estudiantesRegistradosTarde,
              cantidades.estudiantesRegistradosCompleto,
            ],
          },
        ],
      }
    : null;

  return (
    // Add 'position-relative' to the container if your dashboard is absolutely/fixed positioned
    // This makes sure the content respects the available space.
    // Also, added 'overflow-hidden' to prevent horizontal scroll from this component.
    <Container fluid className="py-3 px-0 overflow-hidden">
      <Row className="mb-2 justify-content-center">
        <Col xs={12} md={10} lg={8} xl={7}>
          <h4 className="mb-3 text-center">Resumen General del Sistema</h4>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "350px" }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "450px",
                height: "350px",
                margin: "0 auto",
                position: "relative", // Ensures the chart respects its parent's bounds
              }}
            >
              {loadingCantidades ? (
                <Mensaje tipo={false} className="mt-3">
                  Cargando gráfico
                </Mensaje>
              ) : chartData ? (
                <Doughnut
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false, // ¡Muy importante para controlar el tamaño!
                    plugins: {
                      legend: {
                        display: true,
                        position: "right",
                        labels: {
                          boxWidth: 20,
                          padding: 10,
                        },
                      },
                      title: {
                        display: true,
                        text: "Estadísticas Generales",
                      },
                    },
                  }}
                />
              ) : (
                <Mensaje tipo={false} className="text-center">
                  No se pudo cargar el gráfico.
                </Mensaje>
              )}
            </div>
          </div>
        </Col>
      </Row>
      <hr className="my-4" />
      <Row>
        <Col xs={12} md={12} lg={10} xl={9} className="mx-auto">
          <Form>
            <Form.Group className="mb-3 d-flex flex-wrap align-items-center gap-2">
              <Form.Label className="mb-0 text-break w-100">
                Selecciona el tipo de reporte detallado:
              </Form.Label>
              <Form.Select
                value={opcion}
                onChange={handleSelect}
                className="w-100"
                style={{ maxWidth: "100%" }}
              >
                <option value="">-- Selecciona una opción --</option>
                {opcionesReporte.map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {opcion === "Listado de estudiantes de un conductor" && (
              <Form.Group className="mb-3 d-flex flex-wrap align-items-center gap-2">
                <Form.Label className="mb-0" style={{ whiteSpace: "nowrap" }}>
                  Ruta a buscar
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ejemplo: 11"
                  value={busquedaRuta}
                  onChange={(e) => setBusquedaRuta(e.target.value)}
                  // Removed fixed width styles, letting Bootstrap handle responsiveness more.
                  // Added 'flex-grow-1' to allow it to take available space within flex container.
                  className="flex-grow-1"
                  style={{ maxWidth: "200px" }} // Keep a max-width
                />
              </Form.Group>
            )}
            {opcion && (
              <div className="d-flex justify-content-center">
                <Button
                  className="mb-2 px-4"
                  variant="success"
                  onClick={ReporteTablas}
                  disabled={loadingDetalle}
                  style={{
                    width: "auto",
                    minWidth: 150,
                    // display: "inline-block", // This is usually handled by Bootstrap's flex or block display
                  }}
                >
                  {loadingDetalle ? "Cargando..." : "Generar Reporte"}
                </Button>
              </div>
            )}
          </Form>
          {detalleError && (
            <Mensaje tipo={false} className="mt-3">
              {detalleError}
            </Mensaje>
          )}
          {/* Renderizado dinámico de tablas/listas */}
          {detalle.length > 0 && (
            <Card className="shadow-lg rounded-lg border-0 mt-2">
              <Card.Body>
                {/* The 'table-responsive' class provided by Bootstrap is the key
                    to prevent horizontal scroll on tables. It creates a scrollbar
                    only for the table when it overflows. */}
                <div className="table-responsive">
                  {opcion === "Listado de estudiantes de un conductor" ? (
                    <Table
                      striped
                      bordered
                      hover
                      // responsive="sm" // If you use 'responsive' without a breakpoint, it applies to all breakpoints.
                      // 'responsive' alone is generally sufficient for most cases to add scrollbars when needed.
                      // If you want it to be responsive starting from a specific breakpoint, e.g., 'sm', then use 'responsive="sm"'.
                      className="table-sm text-center"
                    >
                      <thead>
                        <tr
                          style={{
                            backgroundColor: "#1f2833",
                            color: "#ffffff",
                          }}
                        >
                          <th>Nombre</th>
                          <th>Apellido</th>
                          <th>Nivel Escolar</th>
                          <th>Paralelo</th>
                          <th>Turno</th>
                          <th>Cédula</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detalle.map((est) => (
                          <tr
                            style={{ backgroundColor: "#f8f9fa" }}
                            key={est._id}
                          >
                            <td>{est.nombre}</td>
                            <td>{est.apellido}</td>
                            <td>{est.nivelEscolar}</td>
                            <td>{est.paralelo}</td>
                            <td>{est.turno}</td>
                            <td>{est.cedula}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <Table
                      striped
                      bordered
                      hover
                      responsive // This is crucial for horizontal scrolling of tables
                      className="table-sm text-center"
                      // Removed `minWidth` from here, let `responsive` handle it.
                    >
                      <thead>
                        <tr
                          style={{
                            backgroundColor: "#1f2833",
                            color: "#ffffff",
                          }}
                        >
                          <th>Id</th>
                          <th>Nombre</th>
                          <th>Apellido</th>
                          <th>Acción</th>
                          <th>Nombre Remplazo</th>
                          <th>Apellido Remplazo</th>
                          <th>N° estudiantes</th>
                          <th>Fecha</th>
                          {/* Agrega o quita columnas según tu necesidad */}
                        </tr>
                      </thead>
                      <tbody>
                        {detalle.map((item, idx) => (
                          <tr key={item._id || idx}>
                            {/* It's generally better to explicitly map each column to its respective data
                                rather than Object.values(item).map, as the order of keys in an object
                                is not guaranteed unless using ES2015+ Map or specific ordering.
                                For now, I'll keep your existing logic but it's a point to consider
                                for robustness.
                            */}
                            {Object.values(item).map((val, i) => (
                              <td key={i}>
                                {typeof val === "object"
                                  ? JSON.stringify(val)
                                  : val}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ListaReportes;
