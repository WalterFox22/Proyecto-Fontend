import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Loading from "../componets/Loading/Loading";
import Mensaje from "../componets/Alertas/Mensaje";
import axios from "axios";
import Button1 from "../Styles/Syles-Button/ButtonRestPassword";
import Button2 from "../Styles/Syles-Button/ButtonRestPasswordLogin";
import "../Styles/RestPassword.css";
import ErrorRestGift from "../assets/ErrorEmail_animation.webm";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const ResetPassword = () => {
  const { token } = useParams();
  const [tokenValido, setTokenValido] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordActualConfirm, setPasswordActualConfirm] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);


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
      const url = `${
        import.meta.env.VITE_URL_BACKEND
      }/nueva/contrasenia/${token}`;
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
      <div id="reset-password-body">
        <div id="reset-password-glass-container">
          <div id="reset-password-box">
            <h2 id="reset-password-title">Restablecer Contraseña</h2>
            {tokenValido ? (
              <form id="reset-password-form" onSubmit={handleSubmit}>
                <div className="reset-input-container">
                  <input
                    id="reset-password-password"
                    type={showPassword1 ? "text" : "password"}
                    name="passwordActual"
                    value={passwordActual}
                    onChange={(e) => setPasswordActual(e.target.value)}
                    required
                    placeholder="Nueva Contraseña"
                    className="reset-input-with-icon"
                  />
                  <span
                    onClick={() => setShowPassword1(!showPassword1)}
                    className="reset-eye-icon"
                  >
                    {showPassword1 ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
                <div className="reset-input-container">
                  <input
                    id="reset-password-passwordConfirmar"
                    type={showPassword2 ? "text" : "password"}
                    name="passwordActualConfirm"
                    value={passwordActualConfirm}
                    onChange={(e) => setPasswordActualConfirm(e.target.value)}
                    required
                    placeholder="Confirmar Contraseña"
                    className="reset-input-with-icon"
                  />
                  <span
                    onClick={() => setShowPassword2(!showPassword2)}
                    className="reset-eye-icon"
                  >
                    {showPassword2 ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
                <Button1 />
              </form>
            ) : (
              <div id="reset-password-error-container">
                <video
                  src={ErrorRestGift}
                  autoPlay
                  loop
                  muted
                  id="reset-password-error-video"
                />
                <Mensaje tipo={false}>
                  El enlace no es válido o ha expirado.
                </Mensaje>
                <div className="reset-password-btn-error">
                  <Button2 />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default ResetPassword;
