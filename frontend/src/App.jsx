
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthProvider';
import Auth from './layout/Auth';
import Register from './pages/parent/Register';

function App(){
  return(
    <>
      <BrowserRouter>
        <AuthProvider>
        <Routes>
            <Route index element={<Login />} />
            <Route path='/' element={<Auth/>}></Route>
            <Route path='register' element={<Register/>}></Route>
          







        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App;