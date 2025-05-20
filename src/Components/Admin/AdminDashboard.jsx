import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
    if (!token || payload?.rol !== 'admin') {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="admin-container">
      <main className="admin-main">
        <h1>Panel de Administración</h1>
        <div className="admin-buttons">
          <button onClick={() => navigate('/admin/salas')}>Gestionar Salas</button>
          <button onClick={() => navigate('/admin/funciones')}>Gestionar Funciones</button>
          <button onClick={() => navigate('/admin/usuarios')}>Gestionar Usuarios</button>
        </div>
      </main>
      <Sidebar />
    </div>
  );
};

export default AdminDashboard;
