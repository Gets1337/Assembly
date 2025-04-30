import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import {Router} from '../router';


function App() {
  return (
    <CssVarsProvider>
      <CssBaseline />
        <Router />
    </CssVarsProvider>
  );
}

export {App};
