import React from 'react';
import './SeatSelector.css';

const SeatSelector = ({ rows = 10, cols = 15, onToggle, estadoAsientos = [], seleccionados = new Set() }) => {
  // Esta versión ya no se usa directamente porque SeatBooking maneja el render.
  // La dejamos aquí por si la quieres reutilizar más tarde.
  return (
    <div className="seat-selector">
      <div className="screen">PANTALLA</div>
      <div
        className="seats-grid"
        style={{ gridTemplateColumns: `repeat(${cols}, var(--seat-size))` }}
      >
        {Array.from({ length: rows }).flatMap((_, r) =>
          Array.from({ length: cols }).map((_, c) => {
            const key = `${r}-${c}`;
            return (
              <div
                key={key}
                className={`seat ${seleccionados.has(key) ? 'selected' : ''}`}
                onClick={() => onToggle(r, c)}
              />
            );
          })
        )}
      </div>
      <div className="counter">
        Asientos seleccionados: {seleccionados.size}
      </div>
    </div>
  );
};

export default SeatSelector;
