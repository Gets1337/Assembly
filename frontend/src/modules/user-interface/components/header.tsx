import { Box, Typography, IconButton, Stack, Menu, MenuItem, ListItemDecorator } from '@mui/joy';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/stores/auth-store';
import { useState } from 'react';
import AdminReturnButton from '../../admin-interface/components/AdminReturnButton';

export const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    if (anchorEl) {
      // Если меню уже открыто, закрываем его
      setAnchorEl(null);
    } else {
      // Если меню закрыто, открываем его
      setAnchorEl(event.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ 
      width: '100%',
      p: 2,
      background: 'linear-gradient(90deg, #1a237e 0%, #283593 100%)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid',
      borderColor: 'divider',
      position: 'sticky',
      top: 0,
      zIndex: 1100,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      WebkitBackdropFilter: 'blur(10px)',
    }}>
      <Stack 
        direction="row" 
        spacing={2} 
        sx={{ 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '1400px',
          mx: 'auto'
        }}
      >
        <Typography 
          level="h2" 
          onClick={() => navigate('/store')}
          sx={{ 
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
              filter: 'brightness(1.1)',
            },
            userSelect: 'none',
          }}
        >
          Магазин
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <AdminReturnButton />
          <IconButton
            variant="soft"
            color="primary"
            onClick={handleMenuClick}
            sx={{
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
                background: 'rgba(33, 150, 243, 0.1)'
              }
            }}
          >
            <PersonIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              '--ListItem-radius': '8px',
              '--List-padding': '4px',
              '--List-gap': '4px',
            }}
          >
            {user ? (
              <MenuItem 
                onClick={handleLogout}
                sx={{
                  '&:hover': {
                    background: 'rgba(33, 150, 243, 0.1)'
                  }
                }}
              >
                <ListItemDecorator>
                  <LogoutIcon />
                </ListItemDecorator>
                Выйти
              </MenuItem>
            ) : (
              <MenuItem 
                onClick={() => navigate('/login')}
                sx={{
                  '&:hover': {
                    background: 'rgba(33, 150, 243, 0.1)'
                  }
                }}
              >
                <ListItemDecorator>
                  <PersonIcon />
                </ListItemDecorator>
                Войти
              </MenuItem>
            )}
          </Menu>
        </Stack>
      </Stack>
    </Box>
  );
}; 