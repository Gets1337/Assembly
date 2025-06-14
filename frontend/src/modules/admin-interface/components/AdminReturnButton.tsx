import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/joy';
import { useAuthStore } from '../../auth/stores/auth-store';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const AdminReturnButton: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <Button
      variant="outlined"
      color="primary"
      onClick={() => navigate('/admin')}
      size="sm"
      startDecorator={<AdminPanelSettingsIcon fontSize="small" />}
      sx={{ minWidth: 'auto', px: 1.5, py: 0.5, fontSize: 14, fontWeight: 500 }}
    >
      В админку
    </Button>
  );
};

export default AdminReturnButton; 