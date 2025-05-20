import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './ManageFunciones.css';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ManageFunciones = () => {
  const navigate = useNavigate();
  const [funciones, setFunciones] = useState([]);
  const [salas, setSalas] = useState([]);
  const [formData, setFormData] = useState({
    pelicula_nombre: '',
    pelicula_descripcion: '',
    poster_pelicula: '',
    fecha: '',
    id_sala: ''
  });
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
    if (!token || payload?.rol !== 'admin') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [respFunc, respSalas] = await Promise.all([
          axios.get('http://localhost:3000/funciones', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:3000/salas', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setFunciones(respFunc.data);
        setSalas(respSalas.data);
      } catch (err) {
        console.error('Error al obtener datos:', err.response?.data || err.message);
      }
    };
    fetchData();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { pelicula_nombre, pelicula_descripcion, poster_pelicula, fecha, id_sala } = formData;
    if (!pelicula_nombre || !pelicula_descripcion || !fecha || !id_sala) {
      setMensaje('Completa todos los campos');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/funciones', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMensaje('Función creada correctamente');
      // Refrescar lista
      const resp = await axios.get('http://localhost:3000/funciones', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFunciones(resp.data);
      setFormData({
        pelicula_nombre: '',
        pelicula_descripcion: '',
        poster_pelicula: '',
        fecha: '',
        id_sala: ''
      });
    } catch (err) {
      console.error('Error al crear función:', err.response?.data || err.message);
      setMensaje(err.response?.data?.error || 'Error al crear función');
    }
  };

  const handleDelete = async (id, titulo) => {
    const confirmDelete = window.confirm(
      `¿Seguro que quieres eliminar la función "${titulo}" (ID: ${id})?`
    );
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/funciones/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFunciones(funciones.filter((f) => f.id_funcion_pelicula !== id));
      setMensaje('Función eliminada correctamente');
    } catch (err) {
      console.error('Error al eliminar función:', err.response?.data || err.message);
      setMensaje(err.response?.data?.error || 'Error al eliminar función');
    }
  };

  const handleEdit = async (funcion) => {
    const nuevoTitulo = window.prompt('Nuevo título:', funcion.pelicula_nombre);
    if (nuevoTitulo === null) return;
    const nuevaDescripcion = window.prompt(
      'Nueva descripción:',
      funcion.pelicula_descripcion
    );
    if (nuevaDescripcion === null) return;
    const nuevoPoster = window.prompt('Nueva URL póster:', funcion.poster_pelicula);
    if (nuevoPoster === null) return;
    const nuevaFecha = window.prompt('Nueva fecha (YYYY-MM-DD):', funcion.fecha);
    if (nuevaFecha === null) return;
    const nuevaSala = window.prompt('Nuevo ID de sala:', funcion.id_sala);
    if (nuevaSala === null) return;

    try {
      const token = localStorage.getItem('token');
      const body = {
        pelicula_nombre: nuevoTitulo,
        pelicula_descripcion: nuevaDescripcion,
        poster_pelicula: nuevoPoster,
        // `fecha` y `id_sala` no están en el PUT original:  
        // si tu endpoint PUT acepta modificarlos, inclúyelos aquí
      };
      await axios.put(`http://localhost:3000/funciones/${funcion.id_funcion_pelicula}`, body, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refrescar lista
      const resp = await axios.get('http://localhost:3000/funciones', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFunciones(resp.data);
      setMensaje('Función actualizada correctamente');
    } catch (err) {
      console.error('Error al actualizar función:', err.response?.data || err.message);
      setMensaje(err.response?.data?.error || 'Error al actualizar función');
    }
  };

  return (
    <div className="manage-funciones-container">
      <main className="manage-funciones-main">
        <h1>Administrar Funciones</h1>
        <div className="funcion-form-list">
          <form className="funcion-form" onSubmit={handleSubmit}>
            <h2>Crear nueva función</h2>

            <label htmlFor="pelicula_nombre">Título:</label>
            <input
              type="text"
              id="pelicula_nombre"
              value={formData.pelicula_nombre}
              onChange={handleChange}
            />

            <label htmlFor="pelicula_descripcion">Descripción:</label>
            <textarea
              id="pelicula_descripcion"
              value={formData.pelicula_descripcion}
              onChange={handleChange}
            />

            <label htmlFor="poster_pelicula">URL de póster:</label>
            <input
              type="text"
              id="poster_pelicula"
              value={formData.poster_pelicula}
              onChange={handleChange}
            />

            <label htmlFor="fecha">Fecha (YYYY-MM-DD):</label>
            <input
              type="date"
              id="fecha"
              value={formData.fecha}
              onChange={handleChange}
            />

            <label htmlFor="id_sala">Sala:</label>
            <select
              id="id_sala"
              value={formData.id_sala}
              onChange={handleChange}
            >
              <option value="">Selecciona una sala</option>
              {salas.map((s) => (
                <option key={s.id_sala} value={s.id_sala}>
                  {s.numero_sala}
                </option>
              ))}
            </select>

            <button type="submit">Crear Función</button>
            {mensaje && <p className="mensaje">{mensaje}</p>}
          </form>

          <div className="funcion-list">
            <h2>Funciones existentes</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Fecha</th>
                  <th>Sala</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {funciones.map((f) => (
                  <tr key={f.id_funcion_pelicula}>
                    <td>{f.id_funcion_pelicula}</td>
                    <td>{f.pelicula_nombre}</td>
                    <td>{f.fecha}</td>
                    <td>{f.id_sala}</td>
                    <td className="acciones-col">
                      <FaEdit
                        className="icon edit-icon"
                        onClick={() => handleEdit(f)}
                      />
                      <FaTrash
                        className="icon delete-icon"
                        onClick={() =>
                          handleDelete(f.id_funcion_pelicula, f.pelicula_nombre)
                        }
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

export default ManageFunciones;
