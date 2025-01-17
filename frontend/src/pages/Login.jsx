import Logo from '../assets/EMAUS.png';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthProvider';
import axios from 'axios';
import {toast, ToastContainer} from 'react-toastify'


const Login =() =>{

    const navigate = useNavigate()
    const {setAuth, setEstado}= useContext(AuthContext)


    // Paso 1  exraer la informacion de frontend
    const [form, setForm] = useState({
        email:"",
        password:""
    })

    //PASO 2 guardar la informacion obtenida 
    const handleChange =(e) =>{
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    // PASO 3
    const handleSubmit = async(e)=>{
        e.preventDefault()
        try {
            const url= `${import.meta.env.URL_BACKEND}login/conductor`
            const respuesta = await axios.post(url,form)
            localStorage.setItem('token', respuesta.data.token)
            setAuth(respuesta.data)
            console.log(respuesta)
            toast.success(respuesta.data.msg)
            navigate('/dashboard')
            
            
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.msg)
        }
    }

    

    return(
        <>
        <ToastContainer></ToastContainer>
        <body className='body'>

        
           <div class="glass-container">
                <div class="login-box">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <input 
                        value={form.email}
                        onChange={handleChange}
                        type='email' id='email' name='email' required placeholder='Email'/> <br></br>
                        <input 
                        value={form.password}
                        onChange={handleChange}
                        type='password' id='password' name='password' required placeholder='Password'/>
                        
                        <div class= "options">
                            <input type="checkbox" id="remember" name="remember" />
                            <label for="remember">Recordarme</label>
                            <Link to= '/recuperacion' ><a href="#">Olvidaste tu contraseña?</a></Link>

                        </div>

                        
                        <button to='/dashboard' className="btn btn-primary">Ingresar</button>
                

                        <p>¿No tienes una cuenta? </p>
                        <Link to="/register"  className='registro'>Registrate</Link>

                    </form>

                </div>

           </div>
           </body>
        </>
        
    )
}

export default Login;