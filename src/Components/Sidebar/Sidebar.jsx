import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Quitar token
    navigate('/'); // Redirigir a login
  };

  return (
    <aside className="sidebar">
      <h2>Menú</h2>
      <nav>
        <button>Dashboard</button>
        <button>Películas</button>
        <button>Reservas</button>
        <button>Perfil</button>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </nav>
    </aside>
  );
};

export default Sidebar;
