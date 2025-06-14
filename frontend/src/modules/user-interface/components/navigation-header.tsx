import { Box, Tabs, TabList, Tab } from '@mui/joy';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../auth/stores/auth-store';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ReceiptIcon from '@mui/icons-material/Receipt';

export const NavigationHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const getActiveTab = () => {
    if (location.pathname === '/store') return 0;
    if (location.pathname === '/cart') return 1;
    if (location.pathname === '/orders') return 2;
    return 0;
  };

  const handleTabChange = (_: React.SyntheticEvent | null, value: string | number | null) => {
    if (typeof value === 'number') {
      switch (value) {
        case 0:
          navigate('/store');
          break;
        case 1:
          navigate('/cart');
          break;
        case 2:
          navigate('/orders');
          break;
      }
    }
  };

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: '#ffffff',
        borderBottom: '1px solid',
        borderColor: '#DFE6E9',
        mb: 3,
        px: { xs: 1, sm: 2, md: 3 },
        py: 2,
      }}
    >
      <Tabs
        value={getActiveTab()}
        onChange={handleTabChange}
        sx={{
          maxWidth: '1400px',
          mx: 'auto',
        }}
      >
        <TabList
          sx={{
            borderRadius: 'xl',
            p: 0.5,
            bgcolor: 'background.level1',
            '--ListItem-radius': '8px',
            '--List-decorator-width': '32px',
            '--List-decorator-color': 'text.tertiary',
            '--List-gap': '4px',
          }}
        >
          <Tab
            value={0}
            variant={getActiveTab() === 0 ? 'solid' : 'plain'}
            color={getActiveTab() === 0 ? 'primary' : 'neutral'}
            sx={{
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1rem',
              '&.Mui-selected': {
                bgcolor: '#1976D2',
                color: 'white',
                '&:hover': {
                  bgcolor: '#1565C0',
                },
              },
              '&:hover': {
                bgcolor: 'background.level2',
              },
            }}
          >
            <StorefrontIcon sx={{ mr: 1 }} />
            Магазин
          </Tab>
          {user && (
            <>
              <Tab
                value={1}
                variant={getActiveTab() === 1 ? 'solid' : 'plain'}
                color={getActiveTab() === 1 ? 'primary' : 'neutral'}
                sx={{
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  '&.Mui-selected': {
                    bgcolor: '#1976D2',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#1565C0',
                    },
                  },
                  '&:hover': {
                    bgcolor: 'background.level2',
                  },
                }}
              >
                <ShoppingCartIcon sx={{ mr: 1 }} />
                Корзина
              </Tab>
              <Tab
                value={2}
                variant={getActiveTab() === 2 ? 'solid' : 'plain'}
                color={getActiveTab() === 2 ? 'primary' : 'neutral'}
                sx={{
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  '&.Mui-selected': {
                    bgcolor: '#1976D2',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#1565C0',
                    },
                  },
                  '&:hover': {
                    bgcolor: 'background.level2',
                  },
                }}
              >
                <ReceiptIcon sx={{ mr: 1 }} />
                Заказы
              </Tab>
            </>
          )}
        </TabList>
      </Tabs>
    </Box>
  );
}; 