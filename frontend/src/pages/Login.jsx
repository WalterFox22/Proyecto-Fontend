import Logo from '../assets/EMAUS.png';

const Login =() =>{

    return(
        <>
            <div class="text-center">
                <h1>Inicio de Sesión</h1>
                <img src={Logo} class="rounded" alt=""/>
            </div>
            <form>
                <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Correo Electronico</label>
                    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div class="mb-3">
                    <label for="exampleInputPassword1" class="form-label">Contraseña</label>
                    <input type="password" class="form-control" id="exampleInputPassword1"/>
                </div>
                <div class="mb-3 form-check">
                    <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
                    <label class="form-check-label" for="exampleCheck1">Check me out</label>
                </div>
                <button type="submit" class="btn btn-primary">Ingresar</button>
            </form> 
        </>
    )
}

export default Login;