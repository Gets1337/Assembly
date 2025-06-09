import { Box } from '@mui/joy';
import { Header } from './header';
import { Outlet } from 'react-router-dom';

export const UserLayout = () => {
  return (
    <Box sx={{ 
      width: '100vw', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Header />
      <Box sx={{ 
        width: '100%',
        p: 2,
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Outlet />
      </Box>
    </Box>
  );
}; 