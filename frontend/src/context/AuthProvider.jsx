// Comuniar y trasmitir para lanzar la infromaicon a los componentes 
import axios from 'axios'
import { createContext, useEffect, useState} from 'react'

// Creacion del grupo de Whatsapp
const AuthContext = createContext()

// Creacion del mensaje -> Integrantes(children)
const AuthProvider = ({children}) =>{
    const [auth, setAuth] = useState({})
    // La URL del perfil 
    const perfil = async (token)=>{
        try {
            const url = `${import.meta.env.VITE_URL_BACKEND}/perfil`;
            
            // pasos para acceder una una ruta privada
            const options={
                headers:{
                    'Content-Type':'application/json',
                    Authorization:`Bearer ${token}`
                }
            }

            const respuesta = await axios.get(url, options);
            console.warn(respuesta)
            setAuth(respuesta.data)
            
        } catch (error) {
            console.log(error);
        }
    }

    // Para que la informacion no se pierda y se cargo lo que ya se guardo 
    useEffect(() => {
        const token = localStorage.getItem('token') // Verificar el token cuando el componente se carga
        if(token){
            perfil(token)
        } 
    }, []); 

    return (
        <AuthContext.Provider value={
            {
                auth,
                setAuth              
            }
        }>
            {children}
        </AuthContext.Provider>
    )  
}  

// Exportar para ser invocados 
export {
    AuthProvider
}

export default AuthContext
