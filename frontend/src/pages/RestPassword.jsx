import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Loading from "../componets/Loading/Loading";
import Mensaje from "../componets/Alertas/Mensaje";

const ResetPassword = () => {
  const { token } = useParams();
  const [tokenValido, setTokenValido] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordActualConfirm, setPasswordActualConfirm] = useState("");

  useEffect(() => {
    const comprobarToken = async () => {
      try {
        const url = `${
          import.meta.env.VITE_URL_BACKEND
        }/comprobar/token/${token}`;
        const { data } = await axios.get(url);
        toast.success(data.msg_recuperacion_contrasenia);
        setTokenValido(true);
      } catch (error) {
        toast.error(
          error.response?.data?.msg_recuperacion_contrasenia ||
            "Token inválido o expirado"
        );
        setTokenValido(false);
      } finally {
        setLoading(false);
      }
    };
    comprobarToken();
  }, [token]);


  // Envía la nueva contraseña
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordActual || !passwordActualConfirm) {
      toast.error("Debes llenar todos los campos");
      return;
    }
    if (passwordActual !== passwordActualConfirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    try {
      const url = `${import.meta.env.VITE_URL_BACKEND}/recuperacion/nueva-password/${token}`;
      const { data } = await axios.post(url, {
        passwordActual,
        passwordActualConfirm,
      });
      toast.success(data.msg_recuperacion_contrasenia, {
        onClose: () => navigate("/login"),
        autoClose: 3500,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.msg_recuperacion_contrasenia ||
          "Error al actualizar la contraseña"
      );
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <ToastContainer />
      {tokenValido ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Ingrese su nueva contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
            />
            <Form.Text className="text-muted">
              La contraseña debe estar con parámetros.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPasswordConfirm">
            <Form.Label>Confirme su contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={passwordActualConfirm}
              onChange={(e) => setPasswordActualConfirm(e.target.value)}
            />
          </Form.Group>
          <Button
            variant="success"
            className="mt-1"
            style={{ backgroundColor: "#32CD32", border: "none" }}
            type="submit"
          >
            Enviar
          </Button>
        </Form>
      ) : (
        <div className="text-center">
        <Mensaje tipo={false}>El enlace no es válido o ha expirado.</Mensaje>
        <Button variant="primary" onClick={() => navigate("/login")} className="mt-3">
          Volver al Login
        </Button>
      </div>
      )}
    </>
  );
};
export default ResetPassword;
