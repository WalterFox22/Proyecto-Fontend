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

  // Configuración de columnas por tipo de reporte
  const columnasPorReporte = {
    "Reemplazo temporal": [
      { key: "fecha", label: "Fecha" },
      { key: "accion", label: "Acción" },
      { key: "tipoReemplazo", label: "Tipo Reemplazo" },
      { key: "apellidoConductor", label: "Apellido Conductor" },
      { key: "nombreConductor", label: "Nombre Conductor" },
      { key: "apellidoConductorReemplazo", label: "Apellido Reemplazo" },
      { key: "nombreConductorReemplazo", label: "Nombre Reemplazo" },
      { key: "rutaHaCubrir", label: "Ruta a Cubrir" },
      { key: "numeroDeEstudiantesAsignados", label: "N° Estudiantes" },
    ],
    "Reemplazo permanente": [
      { key: "fecha", label: "Fecha" },
      { key: "accion", label: "Acción" },
      { key: "tipoReemplazo", label: "Tipo Reemplazo" },
      { key: "apellidoConductor", label: "Apellido Conductor" },
      { key: "nombreConductor", label: "Nombre Conductor" },
      { key: "apellidoConductorReemplazo", label: "Apellido Reemplazo" },
      { key: "nombreConductorReemplazo", label: "Nombre Reemplazo" },
      { key: "rutaHaCubrir", label: "Ruta a Cubrir" },
      { key: "numeroDeEstudiantesAsignados", label: "N° Estudiantes" },
    ],
    "Activación de conductores originales": [
      { key: "fecha", label: "Fecha" },
      { key: "accion", label: "Acción" },
      { key: "apellidoConductor", label: "Apellido Conductor" },
      { key: "nombreConductor", label: "Nombre Conductor" },
      { key: "apellidoConductorReemplazo", label: "Apellido Reemplazo" },
      { key: "nombreConductorReemplazo", label: "Nombre Reemplazo" },
      { key: "numeroDeEstudiantesAsignados", label: "N° Estudiantes" },
    ],
    "Reemplazo Activos": [
      // Conductor original
      { key: "apellido", label: "Apellido" },
      { key: "nombre", label: "Nombre" },
      { key: "cooperativa", label: "Cooperativa" },
      { key: "institucion", label: "Institución" },
      { key: "placaAutomovil", label: "Placa Automóvil" },
      { key: "rutaAsignada", label: "Ruta Asignada" },
      { key: "sectoresRuta", label: "Sectores Ruta" },
      { key: "numeroEstudiantes", label: "N° Estudiantes" },
      // Reemplazo
      { key: "reemplazoApellido", label: "Apellido Reemplazo" },
      { key: "reemplazoNombre", label: "Nombre Reemplazo" },
      { key: "reemplazoPlaca", label: "Placa Reemplazo" },
    ],
    "Listado de estudiantes de un conductor": [
      { key: "apellido", label: "Apellido" },
      { key: "nombre", label: "Nombre" },
      { key: "cedula", label: "Cédula" },
      { key: "institucion", label: "Institución" },
      { key: "nivelEscolar", label: "Nivel Escolar" },
      { key: "paralelo", label: "Paralelo" },
      { key: "ruta", label: "Ruta" },
      { key: "turno", label: "Turno" },
    ],
  };

  // Función para mapear la data de Reemplazo Activos a columnas planas
  const mapReemplazoActivos = (item) => ({
    apellido: item.conductorOriginal?.apellido || "",
    nombre: item.conductorOriginal?.nombre || "",
    cooperativa: item.conductorOriginal?.cooperativa || "",
    institucion: item.conductorOriginal?.institucion || "",
    placaAutomovil: item.conductorOriginal?.placaAutomovil || "",
    rutaAsignada: item.conductorOriginal?.rutaAsignada || "",
    sectoresRuta: Array.isArray(item.conductorOriginal?.sectoresRuta)
      ? item.conductorOriginal.sectoresRuta.join(", ")
      : item.conductorOriginal?.sectoresRuta || "",
    numeroEstudiantes: item.conductorOriginal?.numeroEstudiantes || "",
    reemplazoApellido: item.reemplazo?.apellido || "",
    reemplazoNombre: item.reemplazo?.nombre || "",
    reemplazoPlaca: item.reemplazo?.placaAutomovil || "",
  });

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
      console.log("Data recibida para", opcion, respuesta.data);
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
                <div className="table-responsive">
                  {/* Listado de estudiantes */}
                  {opcion === "Listado de estudiantes de un conductor" && (
                    <Table
                      striped
                      bordered
                      hover
                      className="table-sm text-center"
                    >
                      <thead>
                        <tr
                          style={{
                            backgroundColor: "#1f2833",
                            color: "#ffffff",
                          }}
                        >
                          {columnasPorReporte[opcion].map((col) => (
                            <th key={col.key}>{col.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {detalle.map((est) => (
                          <tr key={est._id}>
                            {columnasPorReporte[opcion].map((col) => (
                              <td key={col.key}>{est[col.key]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}

                  {/* Reemplazo temporal, permanente, activación */}
                  {(opcion === "Reemplazo temporal" ||
                    opcion === "Reemplazo permanente" ||
                    opcion === "Activación de conductores originales") && (
                    <Table
                      striped
                      bordered
                      hover
                      className="table-sm text-center"
                    >
                      <thead>
                        <tr
                          style={{
                            backgroundColor: "#1f2833",
                            color: "#ffffff",
                          }}
                        >
                          {columnasPorReporte[opcion].map((col) => (
                            <th key={col.key}>{col.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {detalle.map((item, idx) => (
                          <tr key={item._id || idx}>
                            {columnasPorReporte[opcion].map((col) => (
                              <td key={col.key}>{item[col.key]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}

                  {/* Reemplazo Activos: tabla combinada */}
                  {opcion === "Reemplazo Activos" && detalle.length > 0 && (
                    <Table
                      striped
                      bordered
                      hover
                      className="table-sm text-center"
                    >
                      <thead>
                        <tr
                          style={{
                            backgroundColor: "#1f2833",
                            color: "#ffffff",
                          }}
                        >
                          {columnasPorReporte[opcion].map((col) => (
                            <th key={col.key}>{col.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {detalle.map((item, idx) => {
                          const flat = mapReemplazoActivos(item);
                          return (
                            <tr key={idx}>
                              {columnasPorReporte[opcion].map((col) => (
                                <td key={col.key}>{flat[col.key]}</td>
                              ))}
                            </tr>
                          );
                        })}
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
