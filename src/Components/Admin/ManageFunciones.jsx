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

  // Modales
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFuncion, setEditingFuncion] = useState(null);
  const [editData, setEditData] = useState({
    pelicula_nombre: '',
    pelicula_descripcion: '',
    poster_pelicula: '',
    fecha: '',
    id_sala: ''
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingFuncion, setDeletingFuncion] = useState(null);

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

  // Abrir modal de edición y precargar datos de la función
  const openEditModal = (funcion) => {
    setEditingFuncion(funcion);
    setEditData({
      pelicula_nombre: funcion.pelicula_nombre,
      pelicula_descripcion: funcion.pelicula_descripcion,
      poster_pelicula: funcion.poster_pelicula || '',
      fecha: funcion.fecha,
      id_sala: funcion.id_sala.toString()
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.id]: e.target.value });
  };

  const handleEditSubmit = async () => {
    const { pelicula_nombre, pelicula_descripcion, poster_pelicula, fecha, id_sala } = editData;
    if (!pelicula_nombre || !pelicula_descripcion || !fecha || !id_sala) {
      setMensaje('Completa todos los campos de edición');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const body = {
        pelicula_nombre,
        pelicula_descripcion,
        poster_pelicula,
        fecha,
        id_sala: parseInt(id_sala)
      };
      await axios.put(`http://localhost:3000/funciones/${editingFuncion.id_funcion_pelicula}`, body, {
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
    setShowEditModal(false);
    setEditingFuncion(null);
  };

  // Abrir modal de confirmación de borrado
  const openDeleteModal = (funcion) => {
    setDeletingFuncion(funcion);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/funciones/${deletingFuncion.id_funcion_pelicula}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFunciones(funciones.filter((f) => f.id_funcion_pelicula !== deletingFuncion.id_funcion_pelicula));
      setMensaje('Función eliminada correctamente');
    } catch (err) {
      console.error('Error al eliminar función:', err.response?.data || err.message);
      setMensaje(err.response?.data?.error || 'Error al eliminar función');
    }
    setShowDeleteModal(false);
    setDeletingFuncion(null);
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
                        onClick={() => openEditModal(f)}
                      />
                      <FaTrash
                        className="icon delete-icon"
                        onClick={() => openDeleteModal(f)}
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

      {/* Modal de Edición de Función */}
      {showEditModal && (
        <>
          <div
            className="modal-overlay"
            onClick={() => {
              setShowEditModal(false);
              setEditingFuncion(null);
            }}
          />
          <div className="modal-content">
            <h3>Editar Función (ID: {editingFuncion.id_funcion_pelicula})</h3>

            <label htmlFor="pelicula_nombre_edit">Título:</label>
            <input
              type="text"
              id="pelicula_nombre"
              value={editData.pelicula_nombre}
              onChange={(e) => setEditData({ ...editData, pelicula_nombre: e.target.value })}
            />

            <label htmlFor="pelicula_descripcion_edit">Descripción:</label>
            <textarea
              id="pelicula_descripcion"
              value={editData.pelicula_descripcion}
              onChange={(e) => setEditData({ ...editData, pelicula_descripcion: e.target.value })}
            />

            <label htmlFor="poster_pelicula_edit">URL de póster:</label>
            <input
              type="text"
              id="poster_pelicula"
              value={editData.poster_pelicula}
              onChange={(e) => setEditData({ ...editData, poster_pelicula: e.target.value })}
            />

            <label htmlFor="fecha_edit">Fecha (YYYY-MM-DD):</label>
            <input
              type="date"
              id="fecha"
              value={editData.fecha}
              onChange={(e) => setEditData({ ...editData, fecha: e.target.value })}
            />

            <label htmlFor="id_sala_edit">Sala:</label>
            <select
              id="id_sala"
              value={editData.id_sala}
              onChange={(e) => setEditData({ ...editData, id_sala: e.target.value })}
            >
              <option value="">Selecciona una sala</option>
              {salas.map((s) => (
                <option key={s.id_sala} value={s.id_sala}>
                  {s.numero_sala}
                </option>
              ))}
            </select>

            <button onClick={handleEditSubmit}>Guardar cambios</button>
            <button
              className="cancel-button"
              onClick={() => {
                setShowEditModal(false);
                setEditingFuncion(null);
              }}
            >
              Cancelar
            </button>
          </div>
        </>
      )}

      {/* Modal de Confirmación de Borrado de Función */}
      {showDeleteModal && (
        <>
          <div
            className="modal-overlay"
            onClick={() => {
              setShowDeleteModal(false);
              setDeletingFuncion(null);
            }}
          />
          <div className="modal-content">
            <h3>
              ¿Eliminar función "{deletingFuncion.pelicula_nombre}" (ID: {deletingFuncion.id_funcion_pelicula})?
            </h3>
            <button onClick={handleDeleteConfirm}>Sí, eliminar</button>
            <button
              className="cancel-button"
              onClick={() => {
                setShowDeleteModal(false);
                setDeletingFuncion(null);
              }}
            >
              Cancelar
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageFunciones;
