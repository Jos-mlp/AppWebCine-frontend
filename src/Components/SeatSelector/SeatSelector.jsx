import React, { useState } from 'react';
import './SeatSelector.css';

const SeatSelector = ({ rows = 10, cols = 15 }) => {
  const [selected, setSelected] = useState(new Set());

  const toggleSeat = (r, c) => {
    const key = `${r}-${c}`;
    const newSelected = new Set(selected);
    if (newSelected.has(key)) newSelected.delete(key);
    else newSelected.add(key);
    setSelected(newSelected);
  };

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
                className={`seat ${selected.has(key) ? 'selected' : ''}`}
                onClick={() => toggleSeat(r, c)}
              />
            );
          })
        )}
      </div>
      <div className="counter">
        Asientos seleccionados: {selected.size}
      </div>
    </div>
  );
};

export default SeatSelector;
