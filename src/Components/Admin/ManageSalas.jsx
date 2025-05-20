import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './ManageSalas.css';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ManageSalas = () => {
  const navigate = useNavigate();
  const [salas, setSalas] = useState([]);
  const [formData, setFormData] = useState({ numero_sala: '', filas: '', columnas: '' });
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
    if (!token || payload?.rol !== 'admin') {
      navigate('/');
      return;
    }

    const fetchSalas = async () => {
      try {
        const response = await axios.get('http://localhost:3000/salas', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSalas(response.data);
      } catch (err) {
        console.error('Error al obtener salas:', err.response?.data || err.message);
      }
    };
    fetchSalas();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.numero_sala || !formData.filas || !formData.columnas) {
      setMensaje('Completa todos los campos');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const body = {
        numero_sala: formData.numero_sala,
        filas: parseInt(formData.filas),
        columnas: parseInt(formData.columnas)
      };
      await axios.post('http://localhost:3000/salas', body, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMensaje('Sala creada correctamente');
      // Refrescar lista
      const resp = await axios.get('http://localhost:3000/salas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSalas(resp.data);
      setFormData({ numero_sala: '', filas: '', columnas: '' });
    } catch (err) {
      console.error('Error al crear sala:', err.response?.data || err.message);
      setMensaje(err.response?.data?.error || 'Error al crear sala');
    }
  };

  const handleDelete = async (id, numero_sala) => {
    const confirmDelete = window.confirm(
      `¿Seguro que quieres eliminar la sala "${numero_sala}" (ID: ${id})?`
    );
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/salas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSalas(salas.filter((s) => s.id_sala !== id));
      setMensaje('Sala eliminada correctamente');
    } catch (err) {
      console.error('Error al eliminar sala:', err.response?.data || err.message);
      setMensaje(err.response?.data?.error || 'Error al eliminar sala');
    }
  };

  const handleEdit = async (sala) => {
    // Pedir nuevos valores
    const nuevoNumero = window.prompt('Nuevo número de sala:', sala.numero_sala);
    if (nuevoNumero === null) return;
    const nuevasFilas = window.prompt('Nuevas filas:', sala.filas);
    if (nuevasFilas === null) return;
    const nuevasColumnas = window.prompt('Nuevas columnas:', sala.columnas);
    if (nuevasColumnas === null) return;

    try {
      const token = localStorage.getItem('token');
      const body = {
        filas: parseInt(nuevasFilas),
        columnas: parseInt(nuevasColumnas)
        // Modificar numero_sala no está en el endpoint PUT; si lo quieres, necesitarás ajustar backend
      };
      await axios.put(`http://localhost:3000/salas/${sala.id_sala}`, body, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refrescar lista
      const resp = await axios.get('http://localhost:3000/salas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSalas(resp.data);
      setMensaje('Sala actualizada correctamente');
    } catch (err) {
      console.error('Error al actualizar sala:', err.response?.data || err.message);
      setMensaje(err.response?.data?.error || 'Error al actualizar sala');
    }
  };

  return (
    <div className="manage-salas-container">
      <main className="manage-salas-main">
        <h1>Administrar Salas</h1>
        <div className="form-list-container">
          <form className="sala-form" onSubmit={handleSubmit}>
            <h2>Crear nueva sala</h2>
            <label htmlFor="numero_sala">Número de sala:</label>
            <input
              type="text"
              id="numero_sala"
              value={formData.numero_sala}
              onChange={handleChange}
            />
            <label htmlFor="filas">Filas:</label>
            <input
              type="number"
              id="filas"
              value={formData.filas}
              onChange={handleChange}
            />
            <label htmlFor="columnas">Columnas:</label>
            <input
              type="number"
              id="columnas"
              value={formData.columnas}
              onChange={handleChange}
            />
            <button type="submit">Crear Sala</button>
            {mensaje && <p className="mensaje">{mensaje}</p>}
          </form>

          <div className="sala-list">
            <h2>Salas existentes</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Número</th>
                  <th>Filas</th>
                  <th>Columnas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {salas.map((s) => (
                  <tr key={s.id_sala}>
                    <td>{s.id_sala}</td>
                    <td>{s.numero_sala}</td>
                    <td>{s.filas}</td>
                    <td>{s.columnas}</td>
                    <td className="acciones-col">
                      <FaEdit
                        className="icon edit-icon"
                        onClick={() => handleEdit(s)}
                      />
                      <FaTrash
                        className="icon delete-icon"
                        onClick={() => handleDelete(s.id_sala, s.numero_sala)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Sidebar />
    </div>
  );
};

export default ManageSalas;
