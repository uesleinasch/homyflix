import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import { createTheme, MantineProvider, type MantineColorsTuple } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/loginPage/LoginPage';
import RegisterPage from './pages/registerPage/RegisterPage';
import DashboardPage from './pages/dashboardPage/DashboardPage';
import NotFoundPage from './pages/notfoundPage/NotFoundPage';
import PrivateRoute from './shared/components/auth/PrivateRoute';
import PublicRoute from './shared/components/auth/PublicRoute';
import ListMovies from './pages/movies/listMovies/listMovies';
import CreateMovie from './pages/movies/createMovie/CreateMovie';
import MovieDetail from './pages/movies/MovieDetail/MovieDetail';
import ProfilePage from './pages/profile/ProfilePage';
import SettingsPage from './pages/settings/SettingsPage';
import { useTheme } from './shared/hooks/useTheme';
import './App.css'
const myColor: MantineColorsTuple = [
  '#fff4e1',
  '#ffe8cc',
  '#fed09b',
  '#fdb766',
  '#fca13a',
  '#fc931d',
  '#fc8a08',
  '#e17800',
  '#c86a00',
  '#af5a00'
];

const theme = createTheme({
  colors: {
    myColor,
    dark: [
      '#d5d7e0',
      '#acaebf',
      '#8c8fa3',
      '#666980',
      '#4d4f66',
      '#34354a',
      '#2b2c3d',
      '#1d1e30',
      '#0c0d21',
      '#01010a',
    ],
  },
  primaryColor: 'myColor',
  components: {
    Button: {
      defaultProps: {
        variant: 'filled',
      },
    },
  },
});

function App() {
  const { resolvedColorScheme } = useTheme();

  return (
    <MantineProvider theme={theme} forceColorScheme={resolvedColorScheme}>
      <Notifications />
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
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/movies/:id/edit" element={<CreateMovie />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MantineProvider>
  )
}

export default App