import axios from "axios";
import { useEffect, useState } from "react";
import Mensaje from "../../../componets/Alertas/Mensaje";
import { Button, Card, Form, Table } from "react-bootstrap";
import Delete from "../../../assets/borrar1.png";
import Update from "../../../assets/actualizar.png";
import Swal from "sweetalert2";

const ListadeEstudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [error, setError] = useState(null);

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
    RegistroDeListaEstudiantes();
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
        }//eliminar/estudiante/${id}`;
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
        RegistroDeListaEstudiantes();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* Barra de búsqueda */}
      <Form
        className="d-flex justify-content-center mb-3"
        style={{ width: "100%" }}
      >
        <Form.Control
          type="search"
          placeholder="Buscar Conductor por ruta. Ejm: 11"
          className="me-2"
          aria-label="Buscar"
          onChange={(e) => {
            const value = e.target.value;
            //setRutaAsignada(value);  // Actualizar el estado con lo que el usuario escribe

            // Si la barra de búsqueda está vacía, mostramos toda la lista
            if (!value) {
              RegistroDeListaEstudiantes(); // Llama a la función para cargar todos los conductores
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
          //onClick={buscarConductorPorRuta}
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
                {estudiantes.map((estudiantes, index) => (
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

                        //onClick={() =>
                        //navigate(
                        //`/dashboard/buscar/conductor/ruta/${conductor.rutaAsignada}`
                        // )
                        //}
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
    </>
  );
};

export default ListadeEstudiantes;
