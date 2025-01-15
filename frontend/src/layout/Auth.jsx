import {Navigate, Outlet} from 'react-router-dom'

// paa obtener el token 
const Auth = () => {
    const autenticado = localStorage.getItem('token')
    return (
        <main className="flex justify-center content-center w-full h-screen ">   
        {autenticado ? <Navigate to='/dashboard'/> : <Outlet/>}
        </main>
    )
}

export default Auth