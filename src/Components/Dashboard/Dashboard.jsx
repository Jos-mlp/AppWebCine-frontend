import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import SeatSelector from '../SeatSelector/SeatSelector';
import './Dashboard.css';

const MovieCard = ({ movie, onSelect, onReserve }) => (
  <div className="movie-card" onClick={() => onSelect(movie)}>
    <img src={movie.poster} alt={movie.title} />
    <h3>{movie.title}</h3>
    <span className="rating">Rating: {movie.rating}</span>
    <button
      className="reserve-button"
      onClick={e => {
        e.stopPropagation();
        onReserve(movie);
      }}
    >
      Reservar
    </button>
  </div>
);

const MovieList = ({ movies, onSelect, onReserve }) => (
  <div className="grid">
    {movies.map(m => (
      <MovieCard
        key={m.id}
        movie={m}
        onSelect={onSelect}
        onReserve={onReserve}
      />
    ))}
  </div>
);

const MovieDetail = ({ movie, onBack, onReserve }) => (
  <div className="movie-detail">
    <button className="back-button" onClick={onBack}>
      ← Volver
    </button>
    <img src={movie.poster} alt={movie.title} />
    <h2>{movie.title}</h2>
    <p>Rating: {movie.rating}</p>
    <p>{movie.description}</p>
    <button className="reserve-button" onClick={() => onReserve(movie)}>
      Reservar asientos
    </button>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('list');
  const [movie, setMovie] = useState(null);

  // Verificar token al montar para proteger la ruta
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  // Datos de ejemplo; en producción vendrían de un fetch con token
  const movies = [
    {
      id: 1,
      title: 'Inception',
      poster: 'https://images.adsttc.com/media/images/53b5/d563/c07a/80a3/4300/016c/medium_jpg/inception_ver12_xlg.jpg?1404425564',
      rating: '8.8',
      description:
        'Un ladrón que roba secretos corporativos a través de tecnología de compartir sueños.',
    },
    {
      id: 2,
      title: 'The Dark Knight',
      poster: 'https://m.media-amazon.com/images/M/MV5BN2U3NmZjMTYtY2JhOS00NzU4LWJkMDAtZjFmZjAyN2ZlMTMxXkEyXkFqcGc@._V1_.jpg',
      rating: '9.0',
      description:
        'Batman se enfrenta al Joker, un criminal anárquico que causa estragos en Gotham.',
    },
    {
      id: 3,
      title: 'Interstellar',
      poster: 'https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
      rating: '8.6',
      description: 'Viaje épico a través del espacio para salvar a la humanidad.',
    },
    {
      id: 4,
      title: 'Parasite',
      poster: 'https://m.media-amazon.com/images/M/MV5BYjk1Y2U4MjQtY2ZiNS00OWQyLWI3MmYtZWUwNmRjYWRiNWNhXkEyXkFqcGc@._V1_.jpg',
      rating: '8.6',
      description:
        'Una familia pobre se infiltra en la vida de una familia rica con consecuencias inesperadas.',
    },
    {
      id: 5,
      title: 'Avengers: Endgame',
      poster: 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_FMjpg_UX1000_.jpg',
      rating: '8.4',
      description: 'Los héroes restantes se unen para deshacer el chasquido de Thanos.',
    },
  ];

  const handleSelect = m => { setMovie(m); setView('detail'); };
  const handleBackToList = () => { setMovie(null); setView('list'); };
  const handleReserve = m => { setMovie(m); setView('seats'); };
  const handleBackToDetail = () => { setView('detail'); };

  return (
    <div className="dashboard-container">
      <main className="main-content">
        {view === 'list' && (
          <>
            <h1>Cartelera de Películas</h1>
            <MovieList
              movies={movies}
              onSelect={handleSelect}
              onReserve={handleReserve}
            />
          </>
        )}
        {view === 'detail' && movie && (
          <MovieDetail
            movie={movie}
            onBack={handleBackToList}
            onReserve={handleReserve}
          />
        )}
        {view === 'seats' && movie && (
          <div className="seat-booking">
            <h1>Reservar asientos: {movie.title}</h1>
            <SeatSelector rows={10} cols={15} />
            <button className="back-button" onClick={handleBackToDetail}>
              ← Volver al detalle
            </button>
          </div>
        )}
      </main>
      <Sidebar />
    </div>
  );
};

export default Dashboard;
