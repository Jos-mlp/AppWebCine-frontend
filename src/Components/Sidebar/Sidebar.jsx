import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAdmin(false);
      return;
    }

    try {
      // 1. Separa el JWT: header.payload.signature
      const base64Payload = token.split('.')[1];
      // 2. Decodifica Base64 → cadena JSON
      const payloadJson = atob(base64Payload);
      // 3. Convierte JSON a objeto JS
      const payload = JSON.parse(payloadJson);
      // 4. Verifica el rol
      setIsAdmin(payload.rol === 'admin');
    } catch (err) {
      // Si algo falla (token mal formado), no rompemos la UI
      console.error('Error decodificando token en Sidebar:', err);
      setIsAdmin(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <h2>Menú</h2>
      <nav>
        <button onClick={() => navigate('/dashboard')}>Películas</button>
        <button onClick={() => navigate('/reservas')}>Reservas</button>
        {isAdmin && <button onClick={() => navigate('/admin/report')}>Reporte</button>}
        {isAdmin && <button onClick={() => navigate('/admin')}>Admin</button>}
        <button onClick={handleLogout}>Cerrar sesión</button>
      </nav>
    </aside>
  );
};

export default Sidebar;
