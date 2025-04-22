import React from 'react';
import './Sidebar.css';

const Sidebar = () => (
  <aside className="sidebar">
    <h2>Menú</h2>
    <nav>
      <button>Dashboard</button>
      <button>Películas</button>
      <button>Reservas</button>
      <button>Perfil</button>
    </nav>
  </aside>
);

export default Sidebar;
