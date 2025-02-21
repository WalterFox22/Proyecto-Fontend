import React from "react";
import { Container, Row, Col, Image,Button } from "react-bootstrap";
import Rol1 from '../assets/admTrue.png'
import Rol2 from '../assets/drivTrue.png'
import BlurText from "../TextAnimations/BlurText/BlurText";
import '../Styles/styleStart.css'
import { useNavigate } from "react-router-dom";


const Start = () => {

    const navigate=useNavigate()


  return (
    <div className="start-page">
        <div className="container-content">   
            <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
                <BlurText
                text="Escoja el tipo de rol con el que deseas ingresar"
                delay={100}
                animateBy="words"
                direction="top"
                className="blur-text"
                />
            
            <Row className="w-50 text-center">
                <Col>
                <Button
                    variant="light"
                    style={{
                    border: "none",
                    background: "none",
                    padding: 0}}
                    onClick={()=>{
                        localStorage.setItem('rol', 'administrador')
                        navigate('/login')}
                    }

                >
                    <Image src={Rol1} alt="Imagen 1" fluid
                    style={{
                        width: "210px",
                        height: "200px",
                        borderRadius: "10px",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                        e.target.style.transform = "translateY(-5px)";
                        e.target.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
                    }}
                    onMouseOut={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                    }} />
                </Button>

                </Col>
                <Col>
                <Button
                    variant="light"
                    style={{
                    border: "none",
                    background: "none",
                    padding: 0}}
                    onClick={()=>{
                        localStorage.setItem('rol','conductor')
                        navigate('/login')}
                    }

                >
                    <Image src={Rol2} alt="Imagen 2" fluid
                    style={{
                        width: "210px",
                        height: "200px",
                        borderRadius: "10px",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                        e.target.style.transform = "translateY(-5px)";
                        e.target.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
                    }}
                    onMouseOut={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                    }} />

                </Button>
                

                </Col>
            </Row>
            </Container>
        </div>     
    </div>
  );
};

export default Start;
