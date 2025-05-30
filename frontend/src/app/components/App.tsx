import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import { Router } from '../router';
import { useEffect } from 'react';
import { useAuthStore } from '../../modules/auth/stores/auth-store';

function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <CssVarsProvider>
      <CssBaseline />
      <Router />
    </CssVarsProvider>
  );
}
export { App };

