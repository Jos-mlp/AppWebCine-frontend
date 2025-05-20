import './App.css';
import './Components/Login/Login.css';

// --- Componentes existentes ---
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Sidebar from './Components/Sidebar/Sidebar';

// --- Vistas de Cliente ---
import Dashboard from './Components/Customer/Dashboard';
import Reservas from './Components/Reservas/Reservas';
import MovieDetail from './Components/Customer/MovieDetail';
import SeatBooking from './Components/Customer/SeatBooking';

// --- Vistas de Admin ---
import AdminDashboard from './Components/Admin/AdminDashboard';
import ManageSalas from './Components/Admin/ManageSalas';
import ManageFunciones from './Components/Admin/ManageFunciones';
import ManageUsers from './Components/Admin/ManageUsers';

import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/customer/detail',      
    element: <MovieDetail />
  },
  {
    path: '/customer/seats',      
    element: <SeatBooking />
  },
  {
    path: '/reservas',
    element: <Reservas />
  },
  {
    path: '/admin',
    element: <AdminDashboard />
  },
  {
    path: '/admin/salas',
    element: <ManageSalas />
  },
  {
    path: '/admin/funciones',
    element: <ManageFunciones />
  },
  {
    path: '/admin/usuarios',
    element: <ManageUsers />
  }
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
