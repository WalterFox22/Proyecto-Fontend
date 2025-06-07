import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Container} from "react-bootstrap";
import { useParams } from "react-router-dom";
import UnlockUser from "../assets/Carrito.webm";
import Button from "../Styles/Syles-Button/ButtonRestUser";
import gsap from "gsap";
import SplitType from "split-type";
import Loading from "../componets/Loading/Loading";
import ErrorRestGift from '../assets/ErrorEmail_animation.webm'

const MENSAJE_EXITO =
  "¡Desbloqueo exitoso! Gracias por confirmar, su cuenta está lista para usarse.";
const MENSAJE_ERROR =
  "Enlace inválido o expirado. No se pudo completar el desbloqueo.";

const RestUser = () => {
  const { token } = useParams();
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [tipo, setTipo] = useState("success");
  const mensajeRef = useRef(null);

  useEffect(() => {
    const confirmarUserActivo = async () => {
      try {
        const url = `${
          import.meta.env.VITE_URL_BACKEND
        }/besbloquear/token/${token}`;
        const { data } = await axios.get(url);
        setMensaje(data.msg_desbloque);
        setTipo("success");
      } catch (error) {
        setMensaje(
          error.response?.data?.msg_desbloque ||
            "Ocurrió un error al confirmar la reactivacion del Usuario"
        );
        setTipo("danger");
      } finally {
        setLoading(false);
      }
    };
    confirmarUserActivo();
  }, [token]);


  useEffect(() => {
    if (!loading && mensajeRef.current) {
      const split = new SplitType(mensajeRef.current, {
        types: "words, chars",
      });
      gsap.from(split.chars, {
        opacity: 0,
        y: 30,
        stagger: 0.03,
        duration: 0.7,
        ease: "power2.out",
      });
    }
  }, [loading, tipo]);
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ecf2c0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        className="d-flex flex-column align-items-center justify-content-center"
        style={{
          minHeight: "70vh",
          background: "rgba(255,255,255,0.03)",
          borderRadius: "18px",
          boxShadow: "0 4px 32px 0 rgba(0,0,0,0.18)",
          padding: "2.5rem 1.2rem",
          maxWidth: "420px",
        }}
      >
        <h1
          className="mb-4"
          style={{
            color: "#000000",
            fontWeight: 700,
            letterSpacing: "1px",
            fontSize: "2.1rem",
            textShadow: "0 2px 8px #0002",
            textAlign: "center",
          }}
        >
          Desbloqueo de Cuenta
        </h1>
        <video
          src={tipo === "success" ? UnlockUser : ErrorRestGift}
          style={{
            width: "169px",
            height: "auto",
            objectFit: "contain",
            marginBottom: "1.5rem",
          }}
          autoPlay
          loop
          muted
        />
        {loading ? (
          <Loading />
        ) : (
          <div
            ref={mensajeRef}
            style={{
              color: "#000000",
              fontSize: "1.18rem",
              textAlign: "center",
              marginBottom: "2rem",
              fontWeight: 700,
              minHeight: "30px",
            }}
          >
            {tipo === "success" ? MENSAJE_EXITO : MENSAJE_ERROR}
          </div>
        )}
        <Button />
      </Container>
    </div>
  );
};

export default RestUser;
