import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';

// Защищенный маршрут
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Простой компонент для защищенной страницы
const Dashboard = () => {
  const { user, logout } = useAuthStore();
  
  return (
    <div style={{ padding: '20px' }}>
      <button onClick={logout}>Выйти</button>
    </div>
  );
};

function App() {
  return (
    <CssVarsProvider>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </CssVarsProvider>
  );
}

export default App;
