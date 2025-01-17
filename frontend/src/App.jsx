
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthProvider';
import Auth from './layout/Auth';
import Register from './pages/parent/Register';
import LandingPage from './pages/driver/Landinpage';
import { PrivateRoute } from './routes/PrivateRoutes';
import Dashboard from './layout/Dashboard';


function App(){
  return(
    <>
      <BrowserRouter>
        <AuthProvider>
        <Routes>
  
          <Route index element={<Login />} />
              
          <Route path='/' element={<Auth/>}>
            <Route path='register' element={<Register/>}></Route>
          </Route>

          <Route path='dashboard/*' element={
            <PrivateRoute>
              <Routes>
                <Route element={<Dashboard/>}>

                  <Route index element={<LandingPage/>}></Route>
            
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