import Logo from '../assets/EMAUS.png';
import '../App.css';
import { Link } from 'react-router-dom';


const Login =() =>{

    return(
        <>
        <body className='body'>

        
           <div class="glass-container">
                <div class="login-box">
                    <h2>Login</h2>
                    <form action='#' method='POST'>
                        <input type='text' id='username' name='username' required placeholder='Username'/> <br></br>
                        <input type='password' id='password' name='password' required placeholder='Password'/>
                        
                        <div class= "options">
                            <input type="checkbox" id="remember" name="remember" />
                            <label for="remember">Recordarme</label>
                            <a href="#">Olvidaste tu contraseña?</a>
                        </div>

                        <button type='submit'>Ingresar</button>

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