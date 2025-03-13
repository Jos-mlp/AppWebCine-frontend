import React from 'react'
import './Register.css'
import '../../App.css'

import {Link} from 'react-router-dom'

//importar assets
import video from '../../assets/LoginAssets/24496-344562743_tiny.mp4'
import Logo from '../../assets/LoginAssets/logo1.jpg'

//importar Icons
import {FaUserShield} from 'react-icons/fa'
import {BsFillShieldLockFill} from 'react-icons/bs'
import {AiOutlineSwapRight} from 'react-icons/ai'
import {MdMarkEmailRead} from 'react-icons/md'


const Register = () => {
  return (
    <div className='registerPage flex'>
      <div className="container flex">

        <div className="videoDiv">
          <video src={video} autoPlay muted loop></video>
          <div className="textDiv">
            <h2 className="title">Create</h2>
            <p>Sell</p>
          </div>
          <div className="footerDiv flex">
            <span className="text">¿Tienes una cuenta?</span>
            <Link to={'/'}>
            <button className="btn">Ingresar</button></Link>
          </div>
        </div>

        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={Logo} alt="Imagen Logo" />
            <h3>Bienvenido de Regreso</h3>
          </div>

          <form action="" className="form grid">
            <div className="inputDiv">
              <label htmlFor="email">Email</label>
              <div className="input flex">
                <MdMarkEmailRead className="icon"/>
                  <input type="email" id='email' placeholder='Ingresar Email' />
              </div>
            </div>

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
              <span>Registro</span>
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

export default Register