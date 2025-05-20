import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import SeatSelector from './SeatSelector';
import './SeatBooking.css';
import axios from 'axios';
import dayjs from 'dayjs'; // para manejar fechas

const SeatBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pelicula = location.state?.pelicula;
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [proximasFechas, setProximasFechas] = useState([]);
  const [asientosEstado, setAsientosEstado] = useState([]); // [{ id_asiento, fila, columna, estado }, ...]
  const [asientosSeleccionados, setAsientosSeleccionados] = useState(new Set());
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [mensaje, setMensaje] = useState('');

  // Generamos arreglo de próximas 8 fechas (incluye mañana)
  useEffect(() => {
    const hoy = dayjs();
    const arr = [];
    for (let i = 1; i <= 8; i++) {
      arr.push(hoy.add(i, 'day').format('YYYY-MM-DD'));
    }
    setProximasFechas(arr);
    setFechaSeleccionada(arr[0] || '');
  }, []);

  useEffect(() => {
    if (!pelicula) {
      navigate('/dashboard');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    // Al cambiar fecha, obtenemos los estados
    const fetchAsientos = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/reservas/funcion/${pelicula.id_funcion_pelicula}/asientos`,
          {
            params: { fecha: fechaSeleccionada },
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        // response.data = [ { id_asiento, fila, columna, estado }, ... ]
        setAsientosEstado(response.data);
        setAsientosSeleccionados(new Set());
        setQrCodeUrl(null);
      } catch (err) {
        console.error('Error al obtener asientos:', err.response?.data || err.message);
      }
    };
    if (fechaSeleccionada) fetchAsientos();
  }, [fechaSeleccionada, navigate, pelicula]);

  const toggleSeat = (id_asiento) => {
    if (asientosEstado.find(a => a.id_asiento === id_asiento)?.estado !== 'Disponible') return;
    const copia = new Set(asientosSeleccionados);
    if (copia.has(id_asiento)) copia.delete(id_asiento);
    else copia.add(id_asiento);
    setAsientosSeleccionados(copia);
  };

  const handleConfirm = async () => {
    if (asientosSeleccionados.size === 0) {
      setMensaje('Selecciona al menos un asiento.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const body = {
        id_funcion_pelicula: pelicula.id_funcion_pelicula,
        fecha: fechaSeleccionada,
        asientos: Array.from(asientosSeleccionados)
      };
      const response = await axios.post('http://localhost:3000/reservas', body, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // response.data = { reservaId, qrCodeUrl }
      setQrCodeUrl(response.data.qrCodeUrl);
      setMensaje('Reserva confirmada. Descarga tu QR.');
    } catch (err) {
      console.error('Error al crear reserva:', err.response?.data || err.message);
      setMensaje(err.response?.data?.error || 'Error al reservar');
    }
  };

  if (!proximasFechas.length) return null;

  return (
    <div className="seat-booking-container">
      <main className="main-content-seats">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Volver a Cartelera
        </button>
        <h2>Reservar asientos: {pelicula?.pelicula_nombre}</h2>

        <div className="fecha-selector">
          <label>Elige fecha:</label>
          <select
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
          >
            {proximasFechas.map((f) => (
              <option key={f} value={f}>
                {dayjs(f).format('DD/MM/YYYY')}
              </option>
            ))}
          </select>
        </div>

        <div className="seats-grid-container">
          <div className="screen">PANTALLA</div>
          <div
            className="seats-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.max(
                ...asientosEstado.map((a) => a.columna)
              )}, var(--seat-size))`
            }}
          >
            {asientosEstado.map((a) => {
              let cls = 'seat';
              if (a.estado === 'Reservado' || a.estado === 'Ocupado') cls += ' reserved';
              else if (asientosSeleccionados.has(a.id_asiento)) cls += ' selected';
              return (
                <div
                  key={a.id_asiento}
                  className={cls}
                  onClick={() => toggleSeat(a.id_asiento)}
                />
              );
            })}
          </div>
        </div>

        <button className="confirm-button" onClick={handleConfirm}>
          Confirmar Reserva
        </button>
        {mensaje && <p className="mensaje">{mensaje}</p>}
        {qrCodeUrl && (
          <div className="qr-container">
            <h3>Tu código QR:</h3>
            <img src={qrCodeUrl} alt="QR de reserva" />
            <p>Haz clic derecho sobre el QR y “Guardar imagen”</p>
          </div>
        )}
      </main>
      <Sidebar />
    </div>
  );
};

export default SeatBooking;
