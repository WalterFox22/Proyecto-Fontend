// ruta /actualizar/conductor/:id

import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Mensaje from '../../componets/Alertas/Mensaje';
import FormularioRutaSector from '../../componets/Perfil/FomularioRutas';
import Loading from '../../componets/Loading/Loading';

const ActualizarConductor=()=>{

    // Paso 1: Desestructuramos las variblea para la caputuat de la informacion en especial el Id del conductor
    const {rutaAsignada}=useParams()
    const [conductores, setConductores] = useState({})
    const[mensaje, setMensaje]=useState({})
    const [loading, setLoading] = useState(true);

    const ConsultarConductor= async ()=>{
        try {
            // Caputasmos el token 
            const token=localStorage.getItem('token')
            //Definimos la ruta 
            const url= `${import.meta.env.VITE_URL_BACKEND}/buscar/conductor/ruta/${rutaAsignada}`
            // La infomacion capturada se envia al backend
            const options={
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            // Obtenemos la informacion del backend
            const respuesta= await axios.get(url,options)
            //Guardamos la informacion dada de backend
            setConductores(respuesta.data.conductores[0]) /// Verificar en consola si sale Undifine es porque es un array y debes tomar el primer valor [0]
        
        } catch (error) {
            setMensaje({respuesta: error.response.data.msg, tipo: false })
        
        }finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        // Que la funcion solo se ejecute una vez 
        ConsultarConductor()
    },[])

    return(
       
        <Container fluid>
            {/* Encabezado */}
            <div className="text-center mb-4">
                <h1 className="text-dark">Actualición del Conductor</h1>
                <hr />
                <p>Este módulo te permite actualizar a los conductores.</p>
            </div>

            {/* Contenido principal */}
            <Row className="justify-content-center">
                <Col xs={12} md={12} lg={10}>   
                    {/* BarraListar ocupa todo el ancho dentro de la columna */}

                    {loading 
                    ? 
                    (
                        <Loading/>   
                    ) 
                    : 
                    Object.keys(conductores).length 
                    ? 
                    (
                        <FormularioRutaSector conductores={conductores} />
                    ) 
                    : 
                    (
                        mensaje.respuesta && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
                    )}
                    
                    
                </Col>
            </Row>
        </Container>
        
    
    )
}

export default ActualizarConductor