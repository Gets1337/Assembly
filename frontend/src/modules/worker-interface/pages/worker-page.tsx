import { Box, Button, Typography, Grid } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { OrderList } from '../components/order-list';
import { useState } from 'react';

export const WorkerPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Created' | 'Ready'>('Created');

  const handleLogout = () => {
    localStorage.removeItem('token');
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
        <Grid xs={6}>
          <Box
            sx={{
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 'md',
              height: '100%',
              cursor: 'pointer',
              bgcolor: activeTab === 'Created' ? 'background.level1' : 'background.surface',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                bgcolor: 'background.level1',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }
            }}
            onClick={() => setActiveTab('Created')}
          >
            <Typography 
              level="h4" 
              sx={{ 
                mb: 2,
                color: activeTab === 'Created' ? 'primary.500' : 'text.primary',
                fontWeight: 'bold'
              }}
            >
              Несобранные заказы
            </Typography>
            <OrderList status="Created" />
          </Box>
        </Grid>
        <Grid xs={6}>
          <Box
            sx={{
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 'md',
              height: '100%',
              cursor: 'pointer',
              bgcolor: activeTab === 'Ready' ? 'background.level1' : 'background.surface',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                bgcolor: 'background.level1',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }
            }}
            onClick={() => setActiveTab('Ready')}
          >
            <Typography 
              level="h4" 
              sx={{ 
                mb: 2,
                color: activeTab === 'Ready' ? 'primary.500' : 'text.primary',
                fontWeight: 'bold'
              }}
            >
              Готовые к выдаче
            </Typography>
            <OrderList status="Ready" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}; 