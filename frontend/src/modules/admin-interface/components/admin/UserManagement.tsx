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
  Box
} from '@mui/joy';
import { useAdminStore } from '../../store/adminStore';
import { User } from '../../types';

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
      <Box sx={{ p: 2 }}>
        <Typography>Загрузка...</Typography>
      </Box>
    );
  }

  if (error.users) {
    return (
      <Box sx={{ p: 2 }}>
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
      <Sheet variant="outlined">
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
                      sx={{ px: 1, py: 0.5, borderRadius: 1 }}
                    >
                      {getRoleText(user.role.name)}
                    </Typography>
                  </td>
                  <td>{new Date(user.birth_date).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="outlined"
                      size="sm"
                      onClick={() => handleEditClick(user)}
                    >
                      Редактировать
                    </Button>
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

      <Modal open={openDialog} onClose={() => setOpenDialog(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h4">Редактирование пользователя</Typography>
          <Box sx={{ mt: 2 }}>
            <FormControl>
              <FormLabel>ФИО</FormLabel>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </FormControl>
            <FormControl sx={{ mt: 2 }}>
              <FormLabel>Логин</FormLabel>
              <Input
                value={editForm.login}
                onChange={(e) => setEditForm({ ...editForm, login: e.target.value })}
              />
            </FormControl>
            <FormControl sx={{ mt: 2 }}>
              <FormLabel>Дата рождения</FormLabel>
              <Input
                type="date"
                value={editForm.birth_date}
                onChange={(e) => setEditForm({ ...editForm, birth_date: e.target.value })}
              />
            </FormControl>
            <FormControl sx={{ mt: 2 }}>
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
            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="plain"
                color="neutral"
                onClick={() => setOpenDialog(false)}
              >
                Отмена
              </Button>
              <Button onClick={handleSave}>
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