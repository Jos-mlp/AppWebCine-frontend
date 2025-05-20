import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './Dashboard.css';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [peliculas, setPeliculas] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchPeliculas = async () => {
      try {
        const response = await axios.get('http://localhost:3000/funciones', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Backend retorna un array de objetos { id_funcion_pelicula, pelicula_nombre, pelicula_descripcion, poster_pelicula, fecha, id_sala }
        setPeliculas(response.data);
      } catch (err) {
        console.error('Error al obtener funciones:', err.response?.data || err.message);
      }
    };

    fetchPeliculas();
  }, [navigate]);

  const handleSelect = (pelicula) => {
    // Pasamos toda la función en el state de navegación
    navigate('/customer/detail', { state: { pelicula } });
  };

  const handleReserve = (pelicula) => {
    navigate('/customer/seats', { state: { pelicula } });
  };

  return (
    <div className="dashboard-container">
      <main className="main-content">
        <h1>Cartelera de Películas</h1>
        <div className="grid">
          {peliculas.map((m) => (
            <div
              key={m.id_funcion_pelicula}
              className="movie-card"
              onClick={() => handleSelect(m)}
            >
              <img src={m.poster_pelicula} alt={m.pelicula_nombre} />
              <h3>{m.pelicula_nombre}</h3>
              <span className="fecha">Fecha: {m.fecha}</span>
              <p>{m.pelicula_descripcion}</p>
              <button
                className="reserve-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReserve(m);
                }}
              >
                Reservar
              </button>
            </div>
          ))}
        </div>
      </main>
      <Sidebar />
    </div>
  );
};

export default Dashboard;
