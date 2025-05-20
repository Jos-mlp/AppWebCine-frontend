import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './MovieDetail.css';

const MovieDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pelicula = location.state?.pelicula;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
    if (!pelicula) {
      navigate('/dashboard');
    }
  }, [navigate, pelicula]);

  if (!pelicula) return null;

  return (
    <div className="movie-detail-container">
      <main className="main-content-detail">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Volver a Cartelera
        </button>
        <div className="detail-card">
          <img src={pelicula.poster_pelicula} alt={pelicula.pelicula_nombre} />
          <div className="detail-info">
            <h2>{pelicula.pelicula_nombre}</h2>
            <p><strong>Fecha:</strong> {pelicula.fecha}</p>
            <p>{pelicula.pelicula_descripcion}</p>
            <button
              className="reserve-button"
              onClick={() => navigate('/customer/seats', { state: { pelicula } })}
            >
              Reservar asientos
            </button>
          </div>
        </div>
      </main>
      <Sidebar />
    </div>
  );
};

export default MovieDetail;
