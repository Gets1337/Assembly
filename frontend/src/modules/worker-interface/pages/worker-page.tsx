import { Box, Button, Typography, Grid } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { OrderList } from '../components/order-list';
import { useAuthStore } from '../../auth/stores/auth-store';

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
        overflow: 'hidden'
      }}
    >
      <Box 
        sx={{ 
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.level1',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography level="h3" sx={{ fontWeight: 'bold' }}>
          Панель работника
        </Typography>
        <Button
          variant="outlined"
          color="neutral"
          onClick={handleLogout}
          sx={{
            '&:hover': {
              bgcolor: 'background.level2'
            }
          }}
        >
          Выйти
        </Button>
      </Box>
      
      <Grid 
        container 
        spacing={2} 
        sx={{ 
          flex: 1,
          p: 2,
          overflow: 'hidden',
          bgcolor: 'background.surface'
        }}
      >
        <Grid xs={4}>
          <Box
            sx={{
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 'md',
              height: '100%',
              overflow: 'auto',
              bgcolor: 'background.level1'
            }}
          >
            <Typography 
              level="h4" 
              sx={{ 
                mb: 2,
                color: 'primary.500',
                fontWeight: 'bold'
              }}
            >
              Новые заказы
            </Typography>
            <OrderList status="Created" />
          </Box>
        </Grid>
        
        <Grid xs={4}>
          <Box
            sx={{
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 'md',
              height: '100%',
              overflow: 'auto',
              bgcolor: 'background.level2'
            }}
          >
            <Typography 
              level="h4" 
              sx={{ 
                mb: 2,
                color: 'warning.500',
                fontWeight: 'bold'
              }}
            >
              В работе
            </Typography>
            <OrderList status="Worked" />
          </Box>
        </Grid>
        
        <Grid xs={4}>
          <Box
            sx={{
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 'md',
              height: '100%',
              overflow: 'auto',
              bgcolor: 'background.level1'
            }}
          >
            <Typography 
              level="h4" 
              sx={{ 
                mb: 2,
                color: 'success.500',
                fontWeight: 'bold'
              }}
            >
              Готовые заказы
            </Typography>
            <OrderList status="Ready" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}; 