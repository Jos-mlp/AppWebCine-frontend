import './App.css'
import './Components/Login/Login.css'
//importamos componentes
import Dashboard from './Components/Dashboard/Dashboard'
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'

//Importamos React router dom
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'

//Creacion router y rutas
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
  }
])

function App() {
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
