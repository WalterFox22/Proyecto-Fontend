import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthProvider";
import Auth from "./layout/Auth";
import { PrivateRoute } from "./routes/PrivateRoutes";
import Dashboard from "./layout/Dashboard";
import RecuperarContraseña from "./pages/RecuperarContraseña";
import Perfil from "./componets/Perfil/Perfil";
import RegistroConductor from "./pages/admin/RegistroConductor";
import ListarCondutor from "./pages/admin/ListarConductor";
import Error404 from "./componets/Error/Error404";
import PrivateRouteWithRole from "./routes/PrivateRoutesWithRole";
import DashboardDriver from "./layout/DashboardDriver";
import RegistroEstudinates from "./pages/driver/RegistroEstudiantes";
import ListarEstudiantes from "./pages/driver/ListarEstudiantes";
import { EstudientesProvider } from "./context/StudentsProvider";
import ListarCondutorTemp from "./pages/admin/ListarConductoresTemp";
import RegistrarAdmin from "./pages/admin/RegistrarAdmin";
import FirstPassword from "./pages/FirstPassword";
import RemplazoDisponible from "./pages/admin/RemplazoDisponibles";
import ResetPassword from "./pages/RestPassword";
import ConfirmEmail from "./pages/ConfirmEmail";
import RestUser from "./pages/RestUser";
import Reportes from "./pages/admin/Reportes";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <EstudientesProvider>
          <Routes>
            <Route index element={<Login />} />
            <Route path="/" element={<Auth />}>
              <Route path="login" element={<Login />} />
              <Route
                path="recuperacion/contrasenia"
                element={<RecuperarContraseña />}
              />
              <Route
                path="cambiar/contraseña/firt"
                element={<FirstPassword/>}
              />
              <Route
                path="reset-contraseña/:token"
                element={<ResetPassword/>}
              />
              <Route
                path="confirmar-email/:token"
                element={<ConfirmEmail/>}
              />
              <Route
                path="reactivar-usuario/:token"
                element={<RestUser/>}
              />
              <Route path="*" element={<Error404 />} />
            </Route>

            {/* RUTAS PRIVADAS*/}
            {/** ACCESO SOLO ADMIN */}
            <Route
              path="dashboard/*"
              element={
                <PrivateRoute>
                  <PrivateRouteWithRole allowedRoles={["admin"]}>
                    <Routes>
                      <Route element={<Dashboard />}>
                        <Route index element={<Perfil />} />
                        <Route
                          path="registro/conductores"
                          element={<RegistroConductor />}
                        />
                        <Route
                          path="listar/conductores"
                          element={<ListarCondutor />}
                        />
                        <Route
                          path="listar/conductores/temporales"
                          element={<ListarCondutorTemp/>}
                        />
                        <Route
                          path="registro/nuevo/admin"
                          element={<RegistrarAdmin/>}
                        />
                        <Route
                          path="/listar/reemplazo/disponibles"
                          element={<RemplazoDisponible/>}
                        />
                        <Route
                          path='/reportes-generales'
                          element={<Reportes/>}
                        />
                        
                      </Route>
                    </Routes>
                  </PrivateRouteWithRole>
                </PrivateRoute>
              }
            />

            {/** ACCESO SOLO CONDCUTORES */}
            <Route
              path="dashboardConductor/*"
              element={
                <PrivateRoute>
                  <PrivateRouteWithRole allowedRoles={["conductor"]}>
                    <Routes>
                      <Route element={<DashboardDriver />}>
                        <Route index element={<Perfil />} />
                        <Route
                          path="registrar-estudiantes"
                          element={<RegistroEstudinates />}
                        />
                        <Route
                          path="lista-estudiantes"
                          element={<ListarEstudiantes />}
                        />
                      </Route>
                    </Routes>
                  </PrivateRouteWithRole>
                </PrivateRoute>
              }
            />

            <Route path="*" element={<Error404 />} />
          </Routes>
          </EstudientesProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
