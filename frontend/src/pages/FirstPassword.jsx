import "../Styles/styleStart.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthProvider";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Loading from "../componets/Loading/Loading";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Form as BootstrapForm } from "react-bootstrap";

const passwordRegex =
  /^(?=(?:[^A-Za-z]*[A-Za-z]){3})(?=(?:[^0-9]*[0-9]){3})(?=(?:[A-Za-z0-9]*[^A-Za-z0-9]){3})[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{9,}$/;

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Correo electrónico inválido")
    .required("El correo es obligatorio"),
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

const FirstPassword = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    try {
      const url = `${
        import.meta.env.VITE_URL_BACKEND
      }/cambiar/contrasenia/primer/inicio`;
      const cleanValues = {
        email: values.email.trim(),
        passwordActual: values.passwordActual.trim(),
        passwordActualConfirm: values.passwordActualConfirm.trim(),
      };

      const respuesta = await axios.patch(url, cleanValues);

      setAuth(respuesta.data);

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "La contraseña ha sido cambiada correctamente.",
        confirmButtonText: "Aceptar",
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response?.data?.error?.msg ||
          error.response?.data?.msg_cambio_contrasenia ||
          "Error desconocido";
        toast.error(errorMessage, { position: "top-right", autoClose: 3000 });
      } else {
        toast.error("Error de conexión, por favor intenta de nuevo.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer />
      {isSubmitting ? (
        <Loading />
      ) : (
        <div id="first-password-body">
          <div id="first-password-glass-container">
            <div id="first-password-box">
              <h2 id="first-password-title">Cambiar la contraseña</h2>
              <Formik
                initialValues={{
                  email: "",
                  passwordActual: "",
                  passwordActualConfirm: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form id="first-password-form">
                    <Field
                      id="first-password-email"
                      type="email"
                      name="email"
                      placeholder="Correo"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="form-error"
                    />

                    <div className="input-container">
                      <Field
                        id="first-password-password"
                        type={showPassword ? "text" : "password"}
                        name="passwordActual"
                        placeholder="Ej: Abe567+#$"
                        className="input-with-icon"
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="eye-icon"
                        style={{ cursor: "pointer" }}
                      >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                      </span>
                    </div>
                    <ErrorMessage
                      name="passwordActual"
                      component="div"
                      className="form-error"
                    />
                    <BootstrapForm.Text
                      className="text-muted"
                      style={{ marginBottom: 8, display: "block",  color: "#fff" }}
                    >
                      Debe tener <b>3 letras</b>, <b>3 números</b> y{" "}
                      <b>3 caracteres especiales</b>.<br />
                      Ejemplo: <span style={{ color: "#000" }}>Abr980+++</span>
                    </BootstrapForm.Text>

                    <div className="input-container">
                      <Field
                        id="first-password-passwordConfirmar"
                        type={showPassword ? "text" : "password"}
                        name="passwordActualConfirm"
                        placeholder="Confirmación Contraseña"
                        className="input-with-icon"
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="eye-icon"
                        style={{ cursor: "pointer" }}
                      >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                      </span>
                    </div>
                    <ErrorMessage
                      name="passwordActualConfirm"
                      component="div"
                      className="form-error"
                    />

                    <button
                      id="first-password-button"
                      className="btn btn-success"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Cambiar
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FirstPassword;
