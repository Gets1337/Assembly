import React, { useEffect, useState } from 'react';
import {
  Table,
  Sheet,
  Typography,
  Button,
  Modal,
  ModalDialog,
  ModalClose,
  Select,
  Option,
  FormControl,
  FormLabel,
  Input,
  Box,
  useTheme,
  IconButton
} from '@mui/joy';
import { useMediaQuery } from '@mui/material';
import { useAdminStore } from '../../store/adminStore';
import { User } from '../../types';
import EditIcon from '@mui/icons-material/Edit';

const UserManagement: React.FC = () => {
  const { users, isLoading, error, fetchUsers, updateUser } = useAdminStore();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    login: '',
    role: '',
    birth_date: ''
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      name: user.full_name,
      login: user.login,
      role: user.role.name,
      birth_date: new Date(user.birth_date).toISOString().split('T')[0]
    });
    setOpenDialog(true);
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    try {
      await updateUser(selectedUser.id, {
        name: editForm.name,
        login: editForm.login,
        role: editForm.role,
        birth_date: editForm.birth_date
      });
      setOpenDialog(false);
    } catch (error) {
      console.error('Ошибка при обновлении пользователя:', error);
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Администратор';
      case 'user':
        return 'Пользователь';
      case 'worker':
        return 'Сборщик';
      default:
        return role;
    }
  };

  if (isLoading.users) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%', 
        minHeight: '400px'
      }}>
        <Typography>Загрузка...</Typography>
      </Box>
    );
  }

  if (error.users) {
    return (
      <Box sx={{ 
        p: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px'
      }}>
        <Typography color="danger">{error.users}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%'
    }}>
      {isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {users && users.length > 0 ? (
            users.map((user) => (
              <Sheet
                key={user.id}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: '8px',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography level="title-md">Пользователь #{user.id}</Typography>
                  <IconButton
                    size="sm"
                    variant="plain"
                    color="neutral"
                    onClick={() => handleEditClick(user)}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography level="body-sm" textColor="neutral.500">
                    ФИО:
                  </Typography>
                  <Typography>{user.full_name}</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography level="body-sm" textColor="neutral.500">
                    Логин:
                  </Typography>
                  <Typography>{user.login}</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography level="body-sm" textColor="neutral.500">
                    Роль:
                  </Typography>
                  <Typography
                    variant="soft"
                    color={user.role.name === 'admin' ? 'primary' : 'neutral'}
                    sx={{ 
                      px: 1, 
                      py: 0.5, 
                      borderRadius: 1,
                      display: 'inline-block'
                    }}
                  >
                    {getRoleText(user.role.name)}
                  </Typography>
                </Box>
                <Box>
                  <Typography level="body-sm" textColor="neutral.500">
                    Дата рождения:
                  </Typography>
                  <Typography>{new Date(user.birth_date).toLocaleDateString()}</Typography>
                </Box>
              </Sheet>
            ))
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography>Нет пользователей</Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Sheet 
          variant="outlined"
          sx={{
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        >
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>ФИО</th>
                <th>Логин</th>
                <th>Роль</th>
                <th>Дата рождения</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.full_name}</td>
                    <td>{user.login}</td>
                    <td>
                      <Typography
                        variant="soft"
                        color={user.role.name === 'admin' ? 'primary' : 'neutral'}
                        sx={{ 
                          px: 1, 
                          py: 0.5, 
                          borderRadius: 1,
                          display: 'inline-block'
                        }}
                      >
                        {getRoleText(user.role.name)}
                      </Typography>
                    </td>
                    <td>{new Date(user.birth_date).toLocaleDateString()}</td>
                    <td>
                      <IconButton
                        size="sm"
                        variant="plain"
                        color="neutral"
                        onClick={() => handleEditClick(user)}
                      >
                        <EditIcon />
                      </IconButton>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center' }}>
                    <Typography>Нет пользователей</Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Sheet>
      )}

      <Modal open={openDialog} onClose={() => setOpenDialog(false)}>
        <ModalDialog
          sx={{
            maxWidth: 500,
            width: '100%',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
          }}
        >
          <ModalClose />
          <Typography level="h4" sx={{ mb: 2 }}>
            Редактирование пользователя
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <FormLabel>ФИО</FormLabel>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Логин</FormLabel>
              <Input
                value={editForm.login}
                onChange={(e) => setEditForm({ ...editForm, login: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Дата рождения</FormLabel>
              <Input
                type="date"
                value={editForm.birth_date}
                onChange={(e) => setEditForm({ ...editForm, birth_date: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Роль</FormLabel>
              <Select
                value={editForm.role}
                onChange={(_, value) => setEditForm({ ...editForm, role: value as string })}
              >
                <Option value="admin">Администратор</Option>
                <Option value="user">Пользователь</Option>
                <Option value="worker">Сборщик</Option>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              <Button
                variant="plain"
                color="neutral"
                onClick={() => setOpenDialog(false)}
              >
                Отмена
              </Button>
              <Button
                onClick={handleSave}
                sx={{
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                  },
                }}
              >
                Сохранить
              </Button>
            </Box>
          </Box>
        </ModalDialog>
      </Modal>
    </Box>
  );
};

export default UserManagement; 