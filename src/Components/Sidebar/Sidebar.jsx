import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Quita token
    navigate('/'); // Redirige a login
  };

  return (
    <aside className="sidebar">
      <h2>Menú</h2>
      <nav>
        <button onClick={() => navigate('/dashboard')}>Películas</button>
        <button onClick={() => navigate('/reservas')}>Reservas</button>
        <button onClick={() => navigate('/admin')}>Admin</button>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </nav>
    </aside>
  );
};

export default Sidebar;
