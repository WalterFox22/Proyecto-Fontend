import React, { useEffect } from 'react';
import Button from './Button';
import { Container } from 'react-bootstrap';
import LogoError from '../../assets/space.gif'
import './estilo404.css'
import {gsap} from 'gsap';




const NotFoundPage = () => {
  useEffect(() => {
    // Animaciones GSAP para cada número de manera independiente
    gsap.fromTo(".number", 
      { 
        opacity: 0, 
        scale: 0.5, 
        rotate: 180 
      }, 
      { 
        opacity: 1,
        scale: 1, 
        rotate: 0, 
        duration: 1, 
        stagger: 0.2 
      });
  }, []);
 
  return (
    <div className='not-found-page'>
      <Container className="d-flex flex-column align-items-center text-center mt-5">
        {/* El texto 404 con gradiente de mitad blanco y mitad negro */}
        <h1 className="display-1 fw-bold">
          {/* Primer "4" en blanco */}
          <span className="number" style={{
            background: 'linear-gradient(to right, white 50%, white 50%)', // Totalmente blanco
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}>4</span>
          
          {/* "0" con mitad blanco y mitad negro */}
          <span className="number" style={{
            background: 'linear-gradient(to right, white 50%, black 50%)', // Mitad blanco, mitad negro
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}>0</span>

          {/* Segundo "4" en negro */}
          <span className="number" style={{
            background: 'linear-gradient(to right, black 50%, black 50%)', // Totalmente negro
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}>4</span>
        </h1>

        <p className="fs-4 fw-bold mt-3" style={{color:'white'}}>
          ¡Parece que tu nave se desvió! ¿Dónde estamos? 🌠
        </p>

        {/* El GIF aparece después del texto */}
        <img
          src={LogoError}
          alt="Error 404"
          className="mt-4" // Espacio hacia arriba
          style={{ width: '180px', height: '180px' ,marginBottom: '25px'}} // Ajusta el tamaño según lo necesites
        />

        <Button className="mt-8" />
      </Container>
    </div>
  );

};

export default NotFoundPage;













