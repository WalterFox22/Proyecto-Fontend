import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';

const FormularioRegistro = () => {
  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);

  // Esquema de validación con Yup
  const validationSchema = Yup.object({
    nombre: Yup.string()
      .required('El nombre es obligatorio')
      .matches(/^[A-Za-z\s]+$/, 'El nombre solo puede contener letras y espacios'),
    apellido: Yup.string()
      .required('El apellido es obligatorio')
      .matches(/^[A-Za-z\s]+$/, 'El apellido solo puede contener letras y espacios'),
    rutaAsignada: Yup.string()
    .matches(/^\d+$/, 'La ruta debe ser solo un número')
    .required('La ruta asignada es obligatoria'),
    cooperativa:Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'La cooperativa solo puede contener letras y espacios. No colocar tildes')
    .required('La cooperativa es obligatorio'),
    sectoresRuta: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'El sector solo puede contener letras y espacios. No colocar tildes')
    .required('El sector de la ruta es obligatorio'),
    telefono: Yup.string()
      .required('El teléfono es obligatorio')
      .max(10,'El teléfono no debe superar los 10 dígitos')
      .matches(/^\d{10}$/, 'El teléfono debe tener 10 dígitos'),
    placaAutomovil: Yup.string()
    .required('La placa del automóvil es obligatoria')
    .max(8, 'La placa no debe tener más de 8 caracteres, igual como en la placa')
    .matches(/^[A-Z]{3}-\d{4}$/, 'La placa debe tener 3 letras, un guión y 4 números'),
    cedula: Yup.string()
      .required('La cédula es obligatoria')
      .matches(/^\d{10}$/, 'La cédula debe tener 10 dígitos')
      .max(10, 'La cédula no debe superar los 10 dígitos'),
    email: Yup.string()
      .required('El correo electrónico es obligatorio')
      .email('Correo electrónico inválido'),
    generoConductor: Yup.string().required('El género es obligatorio'),
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Obtienes el primer archivo seleccionado
    if (file) {
      setImagen(file); // Guardas el archivo directamente en el estado
      setImagenPreview(URL.createObjectURL(file)); // Creamos una URL temporal para la previsualización
    }
  };

  const handleSubmit = async (values) => {
    const formDataToSend = new FormData();
    Object.keys(values).forEach((key) => {
      formDataToSend.append(key, values[key]);
    });

    if (imagen) {
      formDataToSend.append('fotografiaDelConductor', imagen);
    }

    try {
      const token = localStorage.getItem('token');
      const url = `${import.meta.env.VITE_URL_BACKEND}/registro/conductores`;
      const options = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(url, formDataToSend, options);

      // Si la respuesta es exitosa
      if (response) {
        toast.success('Conductor registrado con éxito y correo enviado');
        
        setImagen(null); // Limpiar la imagen
        setImagenPreview(null); // Limpiar la previsualización
        
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const backendResponse = error.response.data;
        if (backendResponse.errors && Array.isArray(backendResponse.errors)) {
          backendResponse.errors.forEach((err) => {
            toast.error(err.msg);
          });
        } else if (backendResponse.msg_registro_conductor) {
          toast.error(backendResponse.msg_registro_conductor);
        } else {
          toast.error('Error desconocido. Por favor, verifica los datos e intenta nuevamente.');
        }
      } else {
        toast.error('Error de red. Por favor, intenta nuevamente.');
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <Formik
        initialValues={{
          nombre: '',
          apellido: '',
          rutaAsignada: '',
          sectoresRuta: '',
          telefono: '',
          placaAutomovil: '',
          cedula: '',
          email: '',
          cooperativa:'',
          institucion: 'Unidad Educativa Particular Emaús',
          generoConductor: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          touched,
          errors,
          
        }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="nombre" className="mb-3">
              <Form.Label style={{ fontWeight: 'bold' }}>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={values.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ingrese el Nombre"
                isInvalid={touched.nombre && errors.nombre}
              />
              <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="apellido" className="mb-3">
              <Form.Label style={{ fontWeight: 'bold' }}>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                value={values.apellido}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ingrese el Apellido"
                isInvalid={touched.apellido && errors.apellido}
              />
              <Form.Control.Feedback type="invalid">{errors.apellido}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="cooperativa" className="mb-3">
              <Form.Label style={{ fontWeight: 'bold' }}>Cooperativa</Form.Label>
              <Form.Control
                type="text"
                name="cooperativa"
                value={values.cooperativa}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ingrese la cooperativa"
                isInvalid={touched.cooperativa && errors.cooperativa}
              />
              <Form.Control.Feedback type="invalid">{errors.cooperativa}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="rutaAsignada" className="mb-3">
              <Form.Label style={{ fontWeight: 'bold' }}>Ruta Asignada</Form.Label>
              <Form.Control
                type="text"
                name="rutaAsignada"
                value={values.rutaAsignada}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ingrese la ruta (Ejm: 11)"
                isInvalid={touched.rutaAsignada && errors.rutaAsignada}
              />
              <Form.Control.Feedback type="invalid">{errors.rutaAsignada}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="sectoresRuta" className="mb-3">
              <Form.Label style={{ fontWeight: 'bold' }}>Sectores de la Ruta</Form.Label>
              <Form.Control
                type="text"
                name="sectoresRuta"
                value={values.sectoresRuta}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ingrese el sector (Ejm: La Mariscal)"
                isInvalid={touched.sectoresRuta && errors.sectoresRuta}
              />
              <Form.Control.Feedback type="invalid">{errors.sectoresRuta}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="telefono" className="mb-3">
              <Form.Label style={{ fontWeight: 'bold' }}>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                value={values.telefono}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ingrese el teléfono"
                isInvalid={touched.telefono && errors.telefono}
              />
              <Form.Control.Feedback type="invalid">{errors.telefono}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="placaAutomovil" className="mb-3">
              <Form.Label style={{ fontWeight: 'bold' }}>Placa del Automóvil</Form.Label>
              <Form.Control
                type="text"
                name="placaAutomovil"
                value={values.placaAutomovil}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ingrese las placas. Ejemplo: PHT-8888 "
                isInvalid={touched.placaAutomovil && errors.placaAutomovil}
              />
              <Form.Control.Feedback type="invalid">{errors.placaAutomovil}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="cedula" className="mb-3">
              <Form.Label style={{ fontWeight: 'bold' }}>Cédula</Form.Label>
              <Form.Control
                type="text"
                name="cedula"
                value={values.cedula}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ingrese su cédula (solo 10 dígitos)"
                isInvalid={touched.cedula && errors.cedula}
              />
              <Form.Control.Feedback type="invalid">{errors.cedula}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="email" className="mb-3">
              <Form.Label style={{ fontWeight: 'bold' }}>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ingrese el correo electrónico"
                isInvalid={touched.email && errors.email}
              />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="institucion" className="mb-3">
              <Form.Label style={{ fontWeight: 'bold' }}>Institución</Form.Label>
              <Form.Control
                type="text"
                name="institucion"
                value={values.institucion}
                readOnly
              />
            </Form.Group>

            <Form.Group controlId="generoConductor" className="mb-3">
              <Form.Label style={{ fontWeight: 'bold' }}>Género</Form.Label>
              <Form.Control
                as="select"
                name="generoConductor"
                value={values.generoConductor}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.generoConductor && errors.generoConductor}
              >
                <option value="">Seleccione un género</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Prefiero no decirlo">Prefiero no decirlo</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">{errors.generoConductor}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="fotografiaDelConductor" className="mb-3">
              <Form.Label style={{ fontWeight: 'bold' }}>Foto del Conductor</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
              />
               {/* Previsualización de la imagen */}
              {imagenPreview && (
                <div>
                  <img
                    src={imagenPreview}
                    alt="Vista previa"
                    style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px' }}
                  />
                </div>
              )}

            </Form.Group>

            <Button 
            type="submit"         
            variant="success"
            className="mx-auto d-block" 
            style={{
              width: '200px', // Ajusta según necesites
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '10px 20px' // Ajustar relleno
            }}
            >Registrar</Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default FormularioRegistro;
