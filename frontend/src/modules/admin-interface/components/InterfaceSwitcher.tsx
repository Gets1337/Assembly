import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, ButtonGroup, Box } from '@mui/joy';
import { useAuthStore } from '../../auth/stores/auth-store';

const InterfaceSwitcher: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  if (!user || user.role !== 'admin') {
    return null;
  }

  const handleSwitch = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, mt: 2 }}>
      <ButtonGroup>
        <Button
          variant={location.pathname.startsWith('/admin') ? 'solid' : 'outlined'}
          onClick={() => handleSwitch('/admin')}
          color="primary"
        >
          Администратор
        </Button>
        <Button
          variant={location.pathname.startsWith('/worker') ? 'solid' : 'outlined'}
          onClick={() => handleSwitch('/worker')}
          color="primary"
        >
          Сборщик
        </Button>
        <Button
          variant={location.pathname.startsWith('/store') ? 'solid' : 'outlined'}
          onClick={() => handleSwitch('/store')}
          color="primary"
        >
          Пользователь
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default InterfaceSwitcher; 