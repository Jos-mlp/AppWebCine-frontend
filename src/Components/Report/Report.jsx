// frontend/src/Components/Report/Report.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './Report.css';
import axios from 'axios';

const Report = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);     
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar token y rol
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    let payload;
    try {
      payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.rol !== 'admin') {
        navigate('/');
        return;
      }
    } catch {
      navigate('/');
      return;
    }

    // Llamar al endpoint /admin/report
    const fetchReport = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/admin/report',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const resultado = response.data;
        if (Array.isArray(resultado)) {
          setData(resultado);
        } else {
          setError('Respuesta inesperada del servidor');
        }
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/');
          return;
        }
        setError('No se pudo cargar el reporte');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [navigate]);

  if (loading) {
    return (
      <div className="report-container">
        <div className="report-content">
          <p>Cargando reporte...</p>
        </div>
        <Sidebar />
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-container">
        <div className="report-content">
          <p className="error">{error}</p>
        </div>
        <Sidebar />
      </div>
    );
  }

  return (
    <div className="report-container">
      <div className="report-content">
        <h1>Reporte de Actividad (Próximos 8 días)</h1>
        <table className="report-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Butacas Reservadas</th>
              <th>Ingresos (Q)</th>
              <th>Ingresos Perdidos (Q)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.fecha}>
                <td>{new Date(d.fecha).toLocaleDateString('es-ES')}</td>
                <td>{d.reservedCount}</td>
                <td>{d.income.toLocaleString('es-ES')}</td>
                <td>{d.lostIncome.toLocaleString('es-ES')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Sidebar />
    </div>
  );
};

export default Report;
