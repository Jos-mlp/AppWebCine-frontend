import React from 'react'
import './Login.css'
import '../../App.css'

import {Link} from 'react-router-dom'

//importar assets
import video from '../../assets/LoginAssets/24496-344562743_tiny.mp4'
import Logo from '../../assets/LoginAssets/logo1.jpg'

//importar Icons
import {FaUserShield} from 'react-icons/fa'
import {BsFillShieldLockFill} from 'react-icons/bs'
import {AiOutlineSwapRight} from 'react-icons/ai'

const Login = () => {
  return (
    <div className='loginPage flex'>
      <div className="container flex">

        <div className="videoDiv">
          <video src={video} autoPlay muted loop></video>
          <div className="textDiv">
            <h2 className="title">Create</h2>
            <p>Sell</p>
          </div>
          <div className="footerDiv flex">
            <span className="text">¿No tienes una cuenta?</span>
            <Link to={'/register'}>
            <button className="btn">Crear cuenta</button></Link>
          </div>
        </div>

        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={Logo} alt="Imagen Logo" />
            <h3>Bienvenido de Regreso</h3>
          </div>

          <form action="" className="form grid">
            <span className='showMessage'>
              Estado del Login
            </span>
            <div className="inputDiv">
              <label htmlFor="username">Username</label>
              <div className="input flex">
                <FaUserShield className="icon"/>
                  <input type="text" id='username' placeholder='Ingresar Usuario' />
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="password">Contraseña</label>
              <div className="input flex">
                <BsFillShieldLockFill className="icon"/>
                  <input type="password" id='password' placeholder='Ingresar Contraseña' />
              </div>
            </div>  

            <button type='submit' className='btn flex'>
              <span>Login</span>
              <AiOutlineSwapRight className='icon'/>
            </button>         

            <span className='forgotPassword'>
              Forgot your password? <a href="">Click aqui</a>
            </span> 
          </form>

        </div>

      </div>  
    </div>
  )
}

export default Login