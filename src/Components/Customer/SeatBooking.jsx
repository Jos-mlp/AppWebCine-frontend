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

  // Modal de pago
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    email: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  // Temporizador en segundos (5 minutos = 300 segundos)
  const [timeLeft, setTimeLeft] = useState(300);
  const timerRef = useRef(null);

  // Estado de resumen final
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState({});

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
        clearInterval(timerRef.current);
        setTimeLeft(300);
      } catch (err) {
        console.error('Error al obtener asientos:', err.response?.data || err.message);
      }
    };
    if (fechaSeleccionada) fetchAsientos();
  }, [fechaSeleccionada, navigate, pelicula]);

  // Convertir fila numérica a letra
  const filaALetra = (filaNum) => String.fromCharCode(64 + filaNum);

  // Seleccionar / deseleccionar asiento
  const toggleSeat = (id_asiento) => {
    const actual = asientosEstado.find((a) => a.id_asiento === id_asiento);
    if (!actual || actual.estado !== 'Disponible') return;
    const copia = new Set(asientosSeleccionados);
    copia.has(id_asiento) ? copia.delete(id_asiento) : copia.add(id_asiento);
    setAsientosSeleccionados(copia);
  };

  // Abrir modal de pago
  const handleReserveClick = () => {
    if (asientosSeleccionados.size === 0) {
      setMensaje('Selecciona al menos un asiento.');
      return;
    }
    setShowPaymentModal(true);
    setShowSummary(false);
    setTimeLeft(300);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setShowPaymentModal(false);
          setMensaje('Tiempo expirado. Se liberan los asientos.');
          setAsientosSeleccionados(new Set());
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Actualizar estado de pago al escribir
  const handlePaymentChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.id]: e.target.value });
  };

  // Confirmar pago y crear reserva
  const handleConfirmPayment = async () => {
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
      clearInterval(timerRef.current);
      setShowPaymentModal(false);
      setMensaje('');
    } catch (err) {
      console.error('Error al crear reserva:', err.response?.data || err.message);
      setMensaje(err.response?.data?.error || 'Error al reservar');
    }
  };

  // Formatear el temporizador
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="seat-booking-container">
      <main className="main-content-seats">
        <div className="seat-booking-inner">
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
                gridTemplateColumns: `repeat(${Math.max(
                  ...asientosEstado.map((a) => a.columna)
                )}, var(--seat-size))`
              }}
            >
              {asientosEstado.map((a) => {
                let cls = 'seat';
                if (['Reservado', 'Ocupado'].includes(a.estado)) cls += ' reserved';
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

          {/* Resumen final con QR */}
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
              <div
                className="modal-overlay"
                onClick={() => {
                  setShowPaymentModal(false);
                  clearInterval(timerRef.current);
                  setTimeLeft(300);
                  setAsientosSeleccionados(new Set());
                  setMensaje('Se canceló el pago. Se liberan los asientos.');
                }}
              />
              <div className="modal-content">
                <h3>Datos de Pago</h3>
                <p className="timer">Tiempo restante: {formatTime(timeLeft)}</p>

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
                  type="text"
                  id="expiry"
                  placeholder="MM/YY"
                  maxLength="5"
                  pattern="^(0[1-9]|1[0-2])\/\d{2}$"
                  title="Formato MM/YY"
                  required
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
        </div>
      </main>
      <Sidebar />
    </div>
  );
};

export default SeatBooking;
