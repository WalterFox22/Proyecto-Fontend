import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Container } from "react-bootstrap";
import EmailGift from "../assets/Emal_animation.webm";
import ErrorEmailGift from '../assets/ErrorEmail_animation.webm'
import Loading from "../componets/Loading/Loading";
import Button from '../Styles/Syles-Button/ButtonConfrmEmail';
import gsap from "gsap";
import SplitType from "split-type";

const MENSAJE_EXITO = "¡Listo, tu correo ya está confirmado! Puedes iniciar sesión cuando quieras.";
const MENSAJE_ERROR = "El enlace no es válido o ha expirado. Por favor revisa tu correo e inténtalo nuevamente.";

const ConfirmEmail = () => {
  const { token } = useParams();
  //const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [tipo, setTipo] = useState("success");
  const mensajeRef = useRef(null);

  useEffect(() => {
    const confirmarEmail = async () => {
      try {
        const url = `${import.meta.env.VITE_URL_BACKEND}/cambio/email/${token}`;
        const { data } = await axios.get(url);
        //setMensaje(data.msg);
        setTipo("success");
      } catch (error) {
        /*setMensaje(
          error.response?.data?.msg ||
            "Ocurrió un error al confirmar el correo electrónico"
        );
        */
        setTipo("danger");
      } finally {
        setLoading(false);
      }
    };
    confirmarEmail();
  }, [token]);
  

  useEffect(() => {
    if (!loading && mensajeRef.current) {
      const split = new SplitType(mensajeRef.current, { types: "words, chars" });
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
        background: "#CEDBF2",
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
          maxWidth: "420px"
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
            textAlign: "center"
          }}
        >
          Confirmación de Correo
        </h1>
        <video
          src={tipo==="success" ? EmailGift : ErrorEmailGift}
          style={{ width: "169px", height: "auto", objectFit: "contain", marginBottom: "1.5rem" }}
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
              marginBottom: "1.5rem",
              fontWeight: 500,
              minHeight: "30px"
            }}
          >
            {tipo === "success" ? MENSAJE_EXITO : MENSAJE_ERROR}
          </div>
        )}
        
          <Button  />
      </Container>
    </div>
  );
};

export default ConfirmEmail;