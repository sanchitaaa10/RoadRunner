import 'leaflet/dist/leaflet.css'; // <--- ADD THIS LINE
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

// --- JS FORCE FIX START ---
// This manually strips away any default margins or restrictions on the root element
const rootElement = document.getElementById('root');
if (rootElement) {
  rootElement.style.width = '100%';
  rootElement.style.height = '100%';
  rootElement.style.maxWidth = 'none'; // Kills the 1280px limit
  rootElement.style.margin = '0';
  rootElement.style.padding = '0';
  rootElement.style.display = 'block';
}
document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.backgroundColor = '#f4f6f8';
// --- JS FORCE FIX END ---

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);