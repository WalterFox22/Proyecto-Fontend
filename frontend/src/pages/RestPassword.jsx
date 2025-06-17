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
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const passwordRegex =
  /^(?=(?:[^A-Za-z]*[A-Za-z]){3})(?=(?:[^0-9]*[0-9]){3})(?=(?:[A-Za-z0-9]*[^A-Za-z0-9]){3})[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{9,}$/;

const validationSchema = Yup.object().shape({
  passwordActual: Yup.string()
    .matches(
      passwordRegex,
      "Debe tener 3 letras, 3 números y 3 caracteres especiales"
    )
    .required("La contraseña es obligatoria"),
  passwordActualConfirm: Yup.string()
    .oneOf([Yup.ref("passwordActual"), null], "Las contraseñas no coinciden")
    .required("Confirma la contraseña"),
});

const ResetPassword = () => {
  const { token } = useParams();
  const [tokenValido, setTokenValido] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const url = `${
        import.meta.env.VITE_URL_BACKEND
      }/nueva/contrasenia/${token}`;
      const { data } = await axios.patch(url, {
        passwordActual: values.passwordActual,
        passwordActualConfirm: values.passwordActualConfirm,
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
    } finally {
      setSubmitting(false);
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
              <Formik
                initialValues={{
                  passwordActual: "",
                  passwordActualConfirm: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form id="reset-password-form">
                    <div className="reset-input-container">
                      <Field
                        id="reset-password-password"
                        type={showPassword1 ? "text" : "password"}
                        name="passwordActual"
                        placeholder="Nueva contraseña"
                        className="reset-input-with-icon"
                      />
                      <span
                        onClick={() => setShowPassword1(!showPassword1)}
                        className="reset-eye-icon"
                      >
                        {showPassword1 ? <FaEye /> : <FaEyeSlash />}
                      </span>
                    </div>
                    <ErrorMessage
                      name="passwordActual"
                      component="div"
                      className="form-error"
                    />
                    <Form.Text
                      className="text-muted"
                      style={{ marginBottom: 8, display: "block" }}
                    >
                      Debe tener <b>3 letras</b>, <b>3 números</b> y{" "}
                      <b>3 caracteres especiales</b>.<br />
                      Ejemplo: <span style={{ color: "#000" }}>Abr980+++</span>
                    </Form.Text>
                    <div className="reset-input-container">
                      <Field
                        id="reset-password-passwordConfirmar"
                        type={showPassword2 ? "text" : "password"}
                        name="passwordActualConfirm"
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
                    <ErrorMessage
                      name="passwordActualConfirm"
                      component="div"
                      className="form-error"
                    />
                    <Button1 disabled={isSubmitting} />
                  </Form>
                )}
              </Formik>
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
