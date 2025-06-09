import { Box, Typography, IconButton, Stack, Menu, MenuItem, ListItemDecorator } from '@mui/joy';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/stores/auth-store';
import { useState } from 'react';

export const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ 
      width: '100%',
      p: 2,
      borderBottom: '1px solid',
      borderColor: 'divider'
    }}>
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography level="h2">Магазин</Typography>
        <Stack direction="row" spacing={1}>
          <IconButton
            variant="plain"
            color="neutral"
            onClick={handleMenuClick}
          >
            <PersonIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {user ? (
              <MenuItem onClick={handleLogout}>
                <ListItemDecorator>
                  <LogoutIcon />
                </ListItemDecorator>
                Выйти
              </MenuItem>
            ) : (
              <MenuItem onClick={() => navigate('/login')}>
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