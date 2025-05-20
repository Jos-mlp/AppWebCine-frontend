import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './SeatBooking.css';
import axios from 'axios';
import dayjs from 'dayjs';

const SeatBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pelicula = location.state?.pelicula;

  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [proximasFechas, setProximasFechas] = useState([]);
  const [asientosEstado, setAsientosEstado] = useState([]); // {id_asiento, fila, columna, estado}
  const [asientosSeleccionados, setAsientosSeleccionados] = useState(new Set());
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    email: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState({});
  const holdTimerRef = useRef(null);

  // Generar próximas 8 fechas
  useEffect(() => {
    const hoy = dayjs();
    const arr = [];
    for (let i = 1; i <= 8; i++) {
      arr.push(hoy.add(i, 'day').format('YYYY-MM-DD'));
    }
    setProximasFechas(arr);
    setFechaSeleccionada(arr[0] || '');
  }, []);

  // Obtener estados de asientos cuando cambie fecha o película
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

    const fetchAsientos = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/reservas/funcion/${pelicula.id_funcion_pelicula}/asientos`,
          {
            params: { fecha: fechaSeleccionada },
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setAsientosEstado(response.data);
        setAsientosSeleccionados(new Set());
        setQrCodeUrl(null);
        clearTimeout(holdTimerRef.current);
      } catch (err) {
        console.error('Error al obtener asientos:', err.response?.data || err.message);
      }
    };
    if (fechaSeleccionada) fetchAsientos();
  }, [fechaSeleccionada, navigate, pelicula]);

  // Función para convertir número de fila a letra (1->A, 2->B, ...)
  const filaALetra = (filaNum) => {
    return String.fromCharCode(64 + filaNum); // 65 = 'A'
  };

  // Cambiar selección de asientos
  const toggleSeat = (id_asiento) => {
    const actual = asientosEstado.find((a) => a.id_asiento === id_asiento);
    if (!actual || actual.estado !== 'Disponible') return;

    const copia = new Set(asientosSeleccionados);
    if (copia.has(id_asiento)) copia.delete(id_asiento);
    else copia.add(id_asiento);
    setAsientosSeleccionados(copia);
  };

  // Al dar “Reservar”, abrimos modal de pago y “retenemos” temporalmente los asientos
  const handleReserveClick = () => {
    if (asientosSeleccionados.size === 0) {
      setMensaje('Selecciona al menos un asiento.');
      return;
    }
    setShowPaymentModal(true);
    // Iniciar “retención” de 5 minutos: si no se confirma la compra, liberamos los seleccionados
    clearTimeout(holdTimerRef.current);
    holdTimerRef.current = setTimeout(() => {
      setMensaje('Tiempo de reserva expirado. Se han liberado los asientos.');
      setAsientosSeleccionados(new Set());
      setShowPaymentModal(false);
    }, 5 * 60 * 1000); // 5 minutos
  };

  // Manejar cambios en el formulario de pago
  const handlePaymentChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.id]: e.target.value });
  };

  // Al confirmar compra en modal
  const handleConfirmPayment = async () => {
    // Validación básica de campos
    const { email, cardNumber, cardName, expiry, cvv } = paymentData;
    if (!email || !cardNumber || !cardName || !expiry || !cvv) {
      setMensaje('Completa todos los datos de pago.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const body = {
        id_funcion_pelicula: pelicula.id_funcion_pelicula,
        fecha: fechaSeleccionada,
        asientos: Array.from(asientosSeleccionados),
      };
      const response = await axios.post('http://localhost:3000/reservas', body, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // response.data = { reservaId, qrCodeUrl }
      setQrCodeUrl(response.data.qrCodeUrl);
      setSummaryData({
        reservaId: response.data.reservaId,
        pelicula: pelicula.pelicula_nombre,
        fecha: fechaSeleccionada,
        asientos: Array.from(asientosSeleccionados).map((id) => {
          const a = asientosEstado.find((x) => x.id_asiento === id);
          return `${filaALetra(a.fila)}${a.columna}`;
        })
      });
      setShowSummary(true);
      clearTimeout(holdTimerRef.current);
      setShowPaymentModal(false);
      setMensaje('');
    } catch (err) {
      console.error('Error al crear reserva:', err.response?.data || err.message);
      setMensaje(err.response?.data?.error || 'Error al reservar');
    }
  };

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
              const label = `${filaALetra(a.fila)}${a.columna}`;
              return (
                <div
                  key={a.id_asiento}
                  className={cls}
                  onClick={() => toggleSeat(a.id_asiento)}
                >
                  <span className="label">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {!showSummary && (
          <button className="confirm-button" onClick={handleReserveClick}>
            Reservar
          </button>
        )}
        {mensaje && <p className="mensaje">{mensaje}</p>}

        {/* Mostrar resumen final con QR */}
        {showSummary && (
          <div className="qr-container">
            <h3>Reserva Confirmada</h3>
            <p><strong>ID Reserva:</strong> {summaryData.reservaId}</p>
            <p><strong>Película:</strong> {summaryData.pelicula}</p>
            <p><strong>Fecha:</strong> {dayjs(summaryData.fecha).format('DD/MM/YYYY')}</p>
            <p><strong>Asientos:</strong> {summaryData.asientos.join(', ')}</p>
            <img src={qrCodeUrl} alt="QR de reserva" />
            <p>Haz clic derecho sobre el QR y “Guardar imagen”.</p>
          </div>
        )}

        {/* Modal de pago */}
        {showPaymentModal && (
          <>
            <div className="modal-overlay" onClick={() => setShowPaymentModal(false)} />
            <div className="modal-content">
              <h3>Datos de Pago</h3>
              <label htmlFor="email">Correo electrónico:</label>
              <input
                type="email"
                id="email"
                placeholder="correo@ejemplo.com"
                value={paymentData.email}
                onChange={handlePaymentChange}
              />
              <label htmlFor="cardNumber">Número de tarjeta:</label>
              <input
                type="text"
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={handlePaymentChange}
              />
              <label htmlFor="cardName">Nombre en la tarjeta:</label>
              <input
                type="text"
                id="cardName"
                placeholder="Juan Pérez"
                value={paymentData.cardName}
                onChange={handlePaymentChange}
              />
              <label htmlFor="expiry">Fecha de vencimiento:</label>
              <input
                type="month"
                id="expiry"
                value={paymentData.expiry}
                onChange={handlePaymentChange}
              />
              <label htmlFor="cvv">CVV:</label>
              <input
                type="password"
                id="cvv"
                placeholder="123"
                maxLength="4"
                value={paymentData.cvv}
                onChange={handlePaymentChange}
              />
              <button onClick={handleConfirmPayment}>Confirmar compra</button>
            </div>
          </>
        )}
      </main>
      <Sidebar />
    </div>
  );
};

export default SeatBooking;
