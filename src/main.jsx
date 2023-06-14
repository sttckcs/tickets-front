import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react'
import App from './App';
import AuthProvider from './contexts/AuthContext';
import { theme } from './chakra/theme';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <ChakraProvider theme={theme}>
      <StrictMode>
        <App />
      </StrictMode>
    </ChakraProvider>
  </AuthProvider>
);
