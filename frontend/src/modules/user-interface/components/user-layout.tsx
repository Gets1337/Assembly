import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/joy';
import { Header } from './header';

export const UserLayout: React.FC = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
    }}>
      <Header />
      <Box sx={{ 
        flex: 1, 
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: '1400px',
        width: '100%',
        mx: 'auto',
        mt: 2
      }}>
        <Outlet />
      </Box>
    </Box>
  );
}; 