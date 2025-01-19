
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthProvider';
import Auth from './layout/Auth';
import Register from './pages/parent/Register';

import { PrivateRoute } from './routes/PrivateRoutes';
import Dashboard from './layout/Dashboard';
import RecuperarContraseña from './pages/RecuperarContraseña';
import Inicio from './pages/driver/Inicio';
import Perfil from './componets/Perfil/Perfil';
import RegistroConductor from './pages/admin/RegistroConductor';


function App(){
  return(
    <>
      <BrowserRouter>
        <AuthProvider>
        <Routes>
          
          <Route index element={<Login />} />
          <Route path='/' element={<Auth/>}>
            <Route path="login" element={<Login />} />
            <Route path='registro/representantes' element={<Register/>}/>
            <Route path='recuperacion/contrasenia' element = {<RecuperarContraseña/>}/>
          </Route>

          <Route path='dashboard/*' element={
            <PrivateRoute>
              <Routes>
                <Route element={<Dashboard/>}>
                  <Route index element={<Perfil/>}/>

                  <Route path='registro/conductores' element={<Inicio/>}/>
            
                </Route>
              </Routes>
            </PrivateRoute>
          }/>

              

          
            







        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App;