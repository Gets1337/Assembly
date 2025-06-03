import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth-store';
import { validateLogin } from '../utils/validation';
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

interface ValidationErrors {
  login?: string;
  password?: string;
}

export function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuthStore();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Валидация данных
    const validationErrors = validateLogin({
      login,
      password
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authLogin(login, password);
      // Перенаправление в зависимости от роли
      if (response.user.role === 'admin') {
        navigate('/admin');
      } else if (response.user.role === 'worker') {
        navigate('/worker');
      } else {
        navigate('/store');
      }
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({
          login: 'Неверный логин или пароль'
        });
      }
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
            Вход
          </Typography>
          <Typography 
            level="body-sm" 
            sx={{ 
              textAlign: 'center',
              color: 'neutral.500',
            }}
          >
            Войдите в свой аккаунт
          </Typography>
        </div>

        <Divider />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormControl error={!!errors.login}>
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
            {errors.login && (
              <Typography color="danger" fontSize="sm" sx={{ mt: 0.5 }}>
                {errors.login}
              </Typography>
            )}
          </FormControl>

          <FormControl error={!!errors.password}>
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
            {errors.password && (
              <Typography color="danger" fontSize="sm" sx={{ mt: 0.5 }}>
                {errors.password}
              </Typography>
            )}
          </FormControl>

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
            Войти
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
              href="/register"
              sx={{ 
                color: 'primary.600',
                fontWeight: 'bold',
                '&:hover': {
                  color: 'primary.700',
                },
              }}
            >
              Зарегистрироваться
            </Link>
          }
          fontSize="sm"
          sx={{ 
            textAlign: 'center',
            color: 'neutral.600',
          }}
        >
          Нет аккаунта?
        </Typography>
      </Sheet>
    </Box>
  );
} 