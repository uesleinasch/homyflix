import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/loginPage/LoginPage';
import RegisterPage from './pages/registerPage/RegisterPage';
import DashboardPage from './pages/dashboardPage/DashboardPage';
import NotFoundPage from './pages/notfoundPage/NotFoundPage';
import PrivateRoute from './shared/components/auth/PrivateRoute';
import PublicRoute from './shared/components/auth/PublicRoute';
import ListMovies from './pages/movies/listMovies/listMovies';
import CreateMovie from './pages/movies/createMovie/CreateMovie';
import './App.css'

function App() {

  return (
    <MantineProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route path="/" element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route path="/" element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/movies" element={<ListMovies />} />
          <Route path="/movies/create" element={<CreateMovie />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MantineProvider>
  )
}

export default App