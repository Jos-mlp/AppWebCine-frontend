import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './Reservas.css';
import axios from 'axios';

const Reservas = () => {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    const fetchReservas = async () => {
      try {
        const response = await axios.get('http://localhost:3000/reservas', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // response.data = [ { id_reserva, codigoqr, estado, id_usuarios, id_funcion_pelicula }, ... ]
        setReservas(response.data);
      } catch (err) {
        console.error('Error al obtener reservas:', err.response?.data || err.message);
      }
    };
    fetchReservas();
  }, [navigate]);

  return (
    <div className="reservas-container">
      <main className="main-content-reservas">
        <h1>Mis Reservas</h1>
        {reservas.length === 0 ? (
          <p>No tienes reservas aún.</p>
        ) : (
          <table className="tabla-reservas">
            <thead>
              <tr>
                <th>ID Reserva</th>
                <th>Función ID</th>
                <th>Estado</th>
                <th>Ver QR</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((r) => (
                <tr key={r.id_reserva}>
                  <td>{r.id_reserva}</td>
                  <td>{r.id_funcion_pelicula}</td>
                  <td>{r.estado}</td>
                  <td>
                    <a href={r.codigoqr} target="_blank" rel="noopener noreferrer">
                      Descargar QR
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
      <Sidebar />
    </div>
  );
};

export default Reservas;
