import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Loading from "../componets/Loading/Loading";
import Mensaje from "../componets/Alertas/Mensaje";
import axios from "axios";
import Button1 from '../Styles/Syles-Button/ButtonRestPassword'
import Button2 from '../Styles/Syles-Button/ButtonRestUserLogin'

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
      const url = `${import.meta.env.VITE_URL_BACKEND}/nueva/contrasenia/${token}`;
      const { data } = await axios.patch(url, {
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
          <Button1/>
        </Form>
      ) : (
        <div className="text-center">
        <Mensaje tipo={false}>El enlace no es válido o ha expirado.</Mensaje>
        <Button2/>
      </div>
      )}
    </>
  );
};
export default ResetPassword;
