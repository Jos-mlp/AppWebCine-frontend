import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './ManageUsers.css';
import axios from 'axios';

const ManageUsers = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
    if (!token || payload?.rol !== 'admin') {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setMensaje('Ingresa un ID de usuario válido');
      return;
    }

    let username = '';
    try {
      const token = localStorage.getItem('token');
      // Intentamos obtener el username antes de confirmar
      const respUser = await axios.get(`http://localhost:3000/usuarios/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      username = respUser.data.username;
    } catch {
      // Si falla, no tenemos username, sólo mostraremos el ID
    }

    const textoConfirm = username
      ? `¿Seguro que quieres deshabilitar al usuario "${username}" (ID: ${userId})?`
      : `¿Seguro que quieres deshabilitar al usuario con ID: ${userId}?`;

    const confirmDelete = window.confirm(textoConfirm);
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/usuarios/${userId}/disable`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMensaje(`Usuario deshabilitado correctamente`);
      setUserId('');
    } catch (err) {
      console.error('Error al deshabilitar usuario:', err.response?.data || err.message);
      setMensaje(err.response?.data?.error || 'Error al deshabilitar usuario');
    }
  };

  return (
    <div className="manage-users-container">
      <main className="manage-users-main">
        <h1>Administrar Usuarios</h1>
        <form className="user-form" onSubmit={handleSubmit}>
          <label htmlFor="userId">ID de usuario a deshabilitar:</label>
          <input
            type="number"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <button type="submit">Deshabilitar Usuario</button>
          {mensaje && <p className="mensaje">{mensaje}</p>}
        </form>
      </main>
      <Sidebar />
    </div>
  );
};

export default ManageUsers;
