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
  IconButton,
  Alert
} from '@mui/joy';
import { useMediaQuery } from '@mui/material';
import { useAdminStore } from '../../store/adminStore';
import { User } from '../../types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const UserManagement: React.FC = () => {
  const { users, isLoading, error, fetchUsers, updateUser, createUser, deleteUser } = useAdminStore();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    login: '',
    role: '',
    birth_date: ''
  });
  const [createForm, setCreateForm] = useState({
    name: '',
    login: '',
    password: '',
    role: '',
    birth_date: ''
  });
  const [formError, setFormError] = useState<string | null>(null);
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
    setOpenEditDialog(true);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    setFormError(null);
    try {
      await updateUser(selectedUser.id, {
        name: editForm.name,
        login: editForm.login,
        role: editForm.role,
        birth_date: editForm.birth_date
      });
      setOpenEditDialog(false);
    } catch (error) {
      setFormError('Ошибка при обновлении пользователя');
      console.error('Ошибка при обновлении пользователя:', error);
    }
  };

  const handleCreate = async () => {
    setFormError(null);
    try {
      await createUser({
        name: createForm.name,
        login: createForm.login,
        password: createForm.password,
        role: createForm.role,
        birth_date: createForm.birth_date
      });
      setOpenCreateDialog(false);
      setCreateForm({
        name: '',
        login: '',
        password: '',
        role: '',
        birth_date: ''
      });
    } catch (error) {
      setFormError('Ошибка при создании пользователя');
      console.error('Ошибка при создании пользователя:', error);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    setFormError(null);
    try {
      await deleteUser(userToDelete.id);
      setOpenDeleteDialog(false);
      setUserToDelete(null);
    } catch (error) {
      setFormError('Ошибка при удалении пользователя');
      console.error('Ошибка при удалении пользователя:', error);
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'user':
        return 'primary';
      case 'worker':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  if (isLoading.users) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography>Загрузка...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography level="h4" sx={{ fontWeight: 'bold', color: '#1976D2' }}>
          Управление пользователями
        </Typography>
        <Button
          startDecorator={<PersonAddIcon />}
          onClick={() => setOpenCreateDialog(true)}
          sx={{
            background: '#1976D2',
            '&:hover': {
              background: '#1565C0',
            },
          }}
        >
          Добавить пользователя
        </Button>
      </Box>

      {error.users && (
        <Alert color="danger" sx={{ mb: 2 }}>
          {error.users}
        </Alert>
      )}

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
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="sm"
                      variant="plain"
                      color="neutral"
                      onClick={() => handleEditClick(user)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="sm"
                      variant="plain"
                      color="danger"
                      onClick={() => handleDeleteClick(user)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
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
                    color={getRoleColor(user.role.name)}
                    sx={{ 
                      px: 1, 
                      py: 0.5, 
                      borderRadius: 1,
                      display: 'inline-block',
                      fontSize: '0.875rem'
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
                        color={getRoleColor(user.role.name)}
                        sx={{ 
                          px: 1, 
                          py: 0.5, 
                          borderRadius: 1,
                          display: 'inline-block',
                          fontSize: '0.875rem'
                        }}
                      >
                        {getRoleText(user.role.name)}
                      </Typography>
                    </td>
                    <td>{new Date(user.birth_date).toLocaleDateString()}</td>
                    <td>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="sm"
                          variant="plain"
                          color="neutral"
                          onClick={() => handleEditClick(user)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="sm"
                          variant="plain"
                          color="danger"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
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

      {/* Модальное окно редактирования */}
      <Modal open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
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
          {formError && (
            <Alert color="danger" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
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
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="outlined" onClick={() => setOpenEditDialog(false)}>
                Отмена
              </Button>
              <Button onClick={handleSave}>
                Сохранить
              </Button>
            </Box>
          </Box>
        </ModalDialog>
      </Modal>

      {/* Модальное окно создания */}
      <Modal open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
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
            Создание нового пользователя
          </Typography>
          {formError && (
            <Alert color="danger" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <FormLabel>ФИО</FormLabel>
              <Input
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Логин</FormLabel>
              <Input
                value={createForm.login}
                onChange={(e) => setCreateForm({ ...createForm, login: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Пароль</FormLabel>
              <Input
                type="password"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Дата рождения</FormLabel>
              <Input
                type="date"
                value={createForm.birth_date}
                onChange={(e) => setCreateForm({ ...createForm, birth_date: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Роль</FormLabel>
              <Select
                value={createForm.role}
                onChange={(_, value) => setCreateForm({ ...createForm, role: value as string })}
              >
                <Option value="admin">Администратор</Option>
                <Option value="user">Пользователь</Option>
                <Option value="worker">Сборщик</Option>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="outlined" onClick={() => setOpenCreateDialog(false)}>
                Отмена
              </Button>
              <Button onClick={handleCreate}>
                Создать
              </Button>
            </Box>
          </Box>
        </ModalDialog>
      </Modal>

      {/* Модальное окно удаления */}
      <Modal open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <ModalDialog
          sx={{
            maxWidth: 400,
            width: '100%',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
          }}
        >
          <ModalClose />
          <Typography level="h4" sx={{ mb: 2 }}>
            Удаление пользователя
          </Typography>
          {formError && (
            <Alert color="danger" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          <Typography sx={{ mb: 3 }}>
            Вы уверены, что хотите удалить пользователя "{userToDelete?.full_name}"?
            Это действие нельзя отменить.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => setOpenDeleteDialog(false)}>
              Отмена
            </Button>
            <Button color="danger" onClick={handleDelete}>
              Удалить
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </Box>
  );
};

export default UserManagement; 