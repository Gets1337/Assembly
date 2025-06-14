import { Box, Typography, Sheet, IconButton } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { OrderList } from '../components/order-list';
import { useAuthStore } from '../../auth/stores/auth-store';
import AdminReturnButton from '../../admin-interface/components/AdminReturnButton';
import LogoutIcon from '@mui/icons-material/Logout';
import WorkIcon from '@mui/icons-material/Work';

export const WorkerPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.surface',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%)'
      }}
    >
      <Sheet
        variant="solid"
        sx={{
          background: 'linear-gradient(90deg, #1a237e 0%, #283593 100%)',
          p: 2.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <WorkIcon sx={{ color: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', fontSize: 32 }} />
          <Typography 
          level="h3" 
          sx={{ 
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}
        >
          Панель работника
        </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <AdminReturnButton />
          <IconButton
            variant="soft"
            color="neutral"
            onClick={handleLogout}
            sx={{
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.3s ease-in-out'
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Sheet>
      
      <Box 
        sx={{ 
          flex: 1,
          p: 3,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}
      >
        <Sheet
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: 'xl',
            overflow: 'hidden',
            bgcolor: 'background.level1',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid',
            borderColor: 'divider',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          <Typography 
            level="h4" 
            sx={{ 
              mb: 2,
              color: 'primary.700',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box 
              sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                bgcolor: 'primary.500',
                boxShadow: '0 0 12px rgba(25, 118, 210, 0.5)'
              }} 
            />
            Новые заказы
          </Typography>
          <OrderList status="Created" />
        </Sheet>
        
        <Sheet
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: 'xl',
            overflow: 'hidden',
            bgcolor: 'background.level2',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid',
            borderColor: 'divider',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          <Typography 
            level="h4" 
            sx={{ 
              mb: 2,
              color: 'warning.700',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box 
              sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                bgcolor: 'warning.500',
                boxShadow: '0 0 12px rgba(237, 108, 2, 0.5)'
              }} 
            />
            В работе
          </Typography>
          <OrderList status="Worked" />
        </Sheet>
        
        <Sheet
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: 'xl',
            overflow: 'hidden',
            bgcolor: 'background.level3',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid',
            borderColor: 'divider',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          <Typography 
            level="h4" 
            sx={{ 
              mb: 2,
              color: 'success.700',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box 
              sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                bgcolor: 'success.500',
                boxShadow: '0 0 12px rgba(46, 125, 50, 0.5)'
              }} 
            />
            Готовые
          </Typography>
          <OrderList status="Ready" />
        </Sheet>
      </Box>
    </Box>
  );
}; 