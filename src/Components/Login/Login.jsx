import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Login.css'
import '../../App.css'

import video from '../../assets/LoginAssets/24496-344562743_tiny.mp4'
import Logo from '../../assets/LoginAssets/logo.png'

import { FaUserShield } from 'react-icons/fa'
import { BsFillShieldLockFill } from 'react-icons/bs'
import { AiOutlineSwapRight } from 'react-icons/ai'

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        setMessage('Login exitoso');
        navigate('/dashboard');
      } else {
        setMessage(data.error || 'Error de login');
      }
    } catch (err) {
      setMessage('Error del servidor');
      console.error(err);
    }
  }

  return (
    <div className='loginPage flex'>
      <div className="container flex">

        <div className="videoDiv">
          <video src={video} autoPlay muted loop></video>
          <div className="textDiv">
            <h2 className="title">Ingresa</h2>
            <p>Descubre nuestras películas</p>
          </div>
          <div className="footerDiv flex">
            <span className="text">¿No tienes una cuenta?</span>
            <Link to={'/register'}>
              <button className="btn">Crear cuenta</button>
            </Link>
          </div>
        </div>

        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={Logo} alt="Logo" />
            <h3>Bienvenido de Regreso</h3>
          </div>

          <form onSubmit={handleSubmit} className="form grid">
            <span className='showMessage'>{message}</span>

            <div className="inputDiv">
              <label htmlFor="username">Username</label>
              <div className="input flex">
                <FaUserShield className="icon"/>
                <input type="text" id='username' placeholder='Ingresar Usuario' value={formData.username} onChange={handleChange} required/>
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="password">Contraseña</label>
              <div className="input flex">
                <BsFillShieldLockFill className="icon"/>
                <input type="password" id='password' placeholder='Ingresar Contraseña' value={formData.password} onChange={handleChange} required/>
              </div>
            </div>  

            <button type='submit' className='btn flex'>
              <span>Login</span>
              <AiOutlineSwapRight className='icon'/>
            </button>         

            <span className='forgotPassword'>
              ¿Olvidaste tu contraseña? <a href="">Click aquí</a>
            </span> 
          </form>
        </div>
      </div>  
    </div>
  )
}

export default Login
