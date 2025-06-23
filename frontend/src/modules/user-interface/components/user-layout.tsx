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
      position: 'relative',
    }}>
      <Header />
      <Box sx={{ 
        flex: 1, 
        pt: { xs: 1, sm: 2, md: 3 },
        pb: { xs: 2, sm: 3, md: 4 },
        px: { xs: 2, sm: 3, md: 4 },
        maxWidth: '1400px',
        width: '100%',
        mx: 'auto',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#c1c1c1',
          borderRadius: '4px',
          '&:hover': {
            background: '#a8a8a8',
          },
        },
      }}>
        <Outlet />
      </Box>
    </Box>
  );
}; 