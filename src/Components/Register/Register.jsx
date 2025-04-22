import React, { useState } from 'react';
import './Register.css';
import '../../App.css';
import { Link, useNavigate } from 'react-router-dom';

import video from '../../assets/LoginAssets/24496-344562743_tiny.mp4';
import Logo from '../../assets/LoginAssets/logo.png';

import { FaUserShield } from 'react-icons/fa';
import { BsFillShieldLockFill } from 'react-icons/bs';
import { AiOutlineSwapRight } from 'react-icons/ai';
import { MdMarkEmailRead } from 'react-icons/md';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
          //Email
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Usuario registrado correctamente');
        navigate('/'); // Redirige al login
      } else {
        alert(data.error || 'Error al registrar');
      }
    } catch (error) {
      console.error(error);
      alert('Error del servidor');
    }
  };

  return (
    <div className='registerPage flex'>
      <div className="container flex">

        <div className="videoDiv">
          <video src={video} autoPlay muted loop></video>
          <div className="textDiv">
            <h2 className="title">Registrate</h2>
            <p>Entra a un nuevo mundo</p>
          </div>
          <div className="footerDiv flex">
            <span className="text">¿Tienes una cuenta?</span>
            <Link to={'/'}><button className="btn">Ingresar</button></Link>
          </div>
        </div>

        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={Logo} alt="Logo" />
            <h3>Bienvenido de Regreso</h3>
          </div>

          <form className="form grid" onSubmit={handleSubmit}>
            <div className="inputDiv">
              <label htmlFor="email">Email</label>
              <div className="input flex">
                <MdMarkEmailRead className="icon" />
                <input
                  type="email"
                  id="email"
                  placeholder="Ingresar Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="username">Username</label>
              <div className="input flex">
                <FaUserShield className="icon" />
                <input
                  type="text"
                  id="username"
                  placeholder="Ingresar Usuario"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="password">Contraseña</label>
              <div className="input flex">
                <BsFillShieldLockFill className="icon" />
                <input
                  type="password"
                  id="password"
                  placeholder="Ingresar Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="btn flex">
              <span>Registro</span>
              <AiOutlineSwapRight className="icon" />
            </button>

            <span className="forgotPassword">
              ¿Olvidaste tu contraseña? <a href="#">Click aquí</a>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
