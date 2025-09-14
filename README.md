
# DESARROLLO DE SISTEMA PARA LA GESTIÓN DE CONDUCTORES DE LA DE U.E. EMAUS EN LA CIUDAD DE QUITO

Este proyecto se centra en la creación de un sitio web para la gestión de conductores de una institución. Su objetivo principal es permitir al administrador registrar y gestionar la información de los conductores mediante la implementación de un sistema CRUD.


## Herramientas implementadas

- Vite
- React
- JavaScript
- HTML
- CSS
- GSAP
- React bootstrap



## Conjunto de tecnologías

**Cliente:** React, HTML, CSS, React bootstrap

**Servidor:** Node, Express


## Instalación de Dependencias

A continuación, se presentan las dependencias necesarias y los comandos para instalar las dependencias implementadas en el proyecto:

| Dependencia       | Comando de Instalación                           |
|------------------|-----------------------------------------------|
| **Vite**      | `npm i vite` |
| **Dom**      | `npm i react-router-dom` |
| **Iconos de React**        | `npm i react-icons`                           |
| **GSAP (animacion- opcional)**      | `npm i gsap`                         |
| **Animación de botones**      | `npm i styled-components`                        |
| **Bootstrap**    | `npm i react-bootstrap bootstrap`                       |
| **Personalización de alertas**    | `npm i sweetalert2`                       |
| **Validación de formularios**    | `npm i formik yup`                       |
| **React Bits**    | `npx jsrepo init https://reactbits.dev/default`                       |
| **Framer motion (liberia para animación)**    | `npm i framer-motion`                       |
| **Axios**    | ` npm install axios`                       |
| **Chart (liberira para visualizar graficas)**    | ` npm install chart.js react-chartjs-2`                       |


Ejecuta los comandos en la terminal dentro del directorio del proyecto para instalar cada una de las dependencias requeridas.
## Despliegue

Para desplegar el proyecto, ejecutar:

```bash
  npm run dev
```


## Variables de entorno

Para ejecutar este proyecto, se necesita añadir la siguiente variable de entorno en tu archivo .env


`VITE_URL_BACKEND`


## Manual de Instalación

### Requisitos Previos

- Node.js >= 18.x
- npm >= 9.x
- Acceso a la terminal (CMD, PowerShell o terminal integrada de VS Code)
- Editor de código recomendado: Visual Studio Code

### Pasos para la Instalación

1. **Clona el repositorio**
   ```bash
   git clone <URL-del-repositorio>
   cd Proyecto Fontend/frontend
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   - Copia el archivo `.env.example` y renómbralo como `.env`.
   - Edita el archivo `.env` y agrega la URL de tu backend:
     ```
     VITE_URL_BACKEND=http://localhost:3000
     ```

4. **Inicia el proyecto**
   ```bash
   npm run dev
   ```
   - El proyecto estará disponible en `http://localhost:5173` (por defecto).

### Estructura del Proyecto

```
frontend/
│   ├── public/
│   ├── src/
│   │   ├── componets/
│   │   ├── context/
│   │   ├── layout/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── Styles/
│   │   └── TextAnimations/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
```

### Solución de Problemas Comunes

- Si tienes problemas con dependencias, ejecuta:
  ```bash
  npm install --force
  ```
- Si el frontend no conecta con el backend, revisa la variable `VITE_URL_BACKEND` en `.env`.



## Contenido

Para la realización del frontend, el sistema está dividido en secciones destinadas al administrador, quien tiene acceso a las siguientes pantallas:

## Color Reference

| Color             | Hex                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Color Principal Admin| #560C23 |
| Color Principal Conductor| #008080 |
| Color Secundario |  #f8f8f8 |



## Video de Uso

[Manual de Uso](https://youtu.be/HxKuDg8sBFk?si=M3jw2zP4iogGmwyZ)


## Autores

- [@WalterFox22](https://github.com/WalterFox22)

