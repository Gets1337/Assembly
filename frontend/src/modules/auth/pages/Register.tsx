import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth-store';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Typography,
  Sheet,
  Link,
  Divider,
} from '@mui/joy';

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setIsLoading(true);
    
    try {
      await register(login, password, fullName, birthDate);
      navigate('/store');
    } catch (err) {
      setLocalError('Ошибка при регистрации. Возможно, пользователь с таким логином уже существует.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.body',
        background: 'linear-gradient(45deg, #f3f4f6 30%, #e5e7eb 90%)',
      }}
    >
      <Sheet
        variant="outlined"
        sx={{
          width: '100%',
          maxWidth: 400,
          py: 4,
          px: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          borderRadius: 'md',
          boxShadow: 'lg',
          bgcolor: 'background.surface',
          border: '1px solid',
          borderColor: 'divider',
          mx: 2,
        }}
      >
        <div>
          <Typography 
            level="h3" 
            component="h1" 
            sx={{ 
              textAlign: 'center',
              mb: 1,
              color: 'primary.600',
              fontWeight: 'bold',
            }}
          >
            Регистрация
          </Typography>
          <Typography 
            level="body-sm" 
            sx={{ 
              textAlign: 'center',
              color: 'neutral.500',
            }}
          >
            Создайте новый аккаунт для доступа к системе
          </Typography>
        </div>

        <Divider />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormControl>
            <FormLabel>Полное имя</FormLabel>
            <Input
              placeholder="Введите полное имя"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              sx={{
                '--Input-focusedThickness': '2px',
                '--Input-radius': '8px',
              }}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Дата рождения</FormLabel>
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
              sx={{
                '--Input-focusedThickness': '2px',
                '--Input-radius': '8px',
              }}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Логин</FormLabel>
            <Input
              placeholder="Введите логин"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              sx={{
                '--Input-focusedThickness': '2px',
                '--Input-radius': '8px',
              }}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Пароль</FormLabel>
            <Input
              placeholder="Введите пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{
                '--Input-focusedThickness': '2px',
                '--Input-radius': '8px',
              }}
            />
          </FormControl>

          {(localError) && (
            <Typography 
              color="danger" 
              fontSize="sm"
              sx={{ 
                textAlign: 'center',
                bgcolor: 'danger.softBg',
                p: 1,
                borderRadius: 'sm',
              }}
            >
              {localError}
            </Typography>
          )}

          <Button
            type="submit"
            loading={isLoading}
            sx={{ 
              mt: 2,
              py: 1.5,
              fontSize: 'md',
              fontWeight: 'bold',
              borderRadius: '8px',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
              },
            }}
            fullWidth
          >
            Зарегистрироваться
          </Button>
        </form>

        <Divider>
          <Typography level="body-xs" sx={{ color: 'neutral.500' }}>
            или
          </Typography>
        </Divider>

        <Typography
          endDecorator={
            <Link 
              href="/login"
              sx={{ 
                color: 'primary.600',
                fontWeight: 'bold',
                '&:hover': {
                  color: 'primary.700',
                },
              }}
            >
              Войти
            </Link>
          }
          fontSize="sm"
          sx={{ 
            textAlign: 'center',
            color: 'neutral.600',
          }}
        >
          Уже есть аккаунт?
        </Typography>
      </Sheet>
    </Box>
  );
} 