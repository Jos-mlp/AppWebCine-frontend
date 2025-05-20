import React, { useState, useEffect, useRef } from 'react';
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

  // Estados para modales
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSala, setEditingSala] = useState(null);
  const [editData, setEditData] = useState({ numero_sala: '', filas: '', columnas: '' });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingSala, setDeletingSala] = useState(null);

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

  // Abrir modal de edición y precargar datos
  const openEditModal = (sala) => {
    setEditingSala(sala);
    setEditData({
      numero_sala: sala.numero_sala,
      filas: sala.filas.toString(),
      columnas: sala.columnas.toString()
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.id]: e.target.value });
  };

  const handleEditSubmit = async () => {
    if (!editData.numero_sala || !editData.filas || !editData.columnas) {
      setMensaje('Completa todos los campos de edición');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const body = {
        filas: parseInt(editData.filas),
        columnas: parseInt(editData.columnas)
        // Si necesitas permitir editar numero_sala, agrégalo en el endpoint PUT backend y aquí
      };
      await axios.put(`http://localhost:3000/salas/${editingSala.id_sala}`, body, {
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
    setShowEditModal(false);
    setEditingSala(null);
  };

  // Abrir modal de confirmación de borrado
  const openDeleteModal = (sala) => {
    setDeletingSala(sala);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/salas/${deletingSala.id_sala}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSalas(salas.filter((s) => s.id_sala !== deletingSala.id_sala));
      setMensaje('Sala eliminada correctamente');
    } catch (err) {
      console.error('Error al eliminar sala:', err.response?.data || err.message);
      setMensaje(err.response?.data?.error || 'Error al eliminar sala');
    }
    setShowDeleteModal(false);
    setDeletingSala(null);
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
                        onClick={() => openEditModal(s)}
                      />
                      <FaTrash
                        className="icon delete-icon"
                        onClick={() => openDeleteModal(s)}
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

      {/* Modal de Edición */}
      {showEditModal && (
        <>
          <div
            className="modal-overlay"
            onClick={() => {
              setShowEditModal(false);
              setEditingSala(null);
            }}
          />
          <div className="modal-content">
            <h3>Editar Sala (ID: {editingSala.id_sala})</h3>
            <label htmlFor="numero_sala_edit">Número de sala:</label>
            <input
              type="text"
              id="numero_sala_edit"
              value={editData.numero_sala}
              onChange={(e) => setEditData({ ...editData, numero_sala: e.target.value })}
            />
            <label htmlFor="filas_edit">Filas:</label>
            <input
              type="number"
              id="filas_edit"
              value={editData.filas}
              onChange={(e) => setEditData({ ...editData, filas: e.target.value })}
            />
            <label htmlFor="columnas_edit">Columnas:</label>
            <input
              type="number"
              id="columnas_edit"
              value={editData.columnas}
              onChange={(e) => setEditData({ ...editData, columnas: e.target.value })}
            />
            <button onClick={handleEditSubmit}>Guardar cambios</button>
            <button
              className="cancel-button"
              onClick={() => {
                setShowEditModal(false);
                setEditingSala(null);
              }}
            >
              Cancelar
            </button>
          </div>
        </>
      )}

      {/* Modal de Confirmación de Borrado */}
      {showDeleteModal && (
        <>
          <div
            className="modal-overlay"
            onClick={() => {
              setShowDeleteModal(false);
              setDeletingSala(null);
            }}
          />
          <div className="modal-content">
            <h3>
              ¿Eliminar sala "{deletingSala.numero_sala}" (ID: {deletingSala.id_sala})?
            </h3>
            <button onClick={handleDeleteConfirm}>Sí, eliminar</button>
            <button
              className="cancel-button"
              onClick={() => {
                setShowDeleteModal(false);
                setDeletingSala(null);
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

export default ManageSalas;
