import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Shim process for libraries that expect it in the browser
if (typeof window !== 'undefined') {
  if (!(window as any).process) {
    (window as any).process = { env: { NODE_ENV: 'production' } };
  } else if (!(window as any).process.env) {
    (window as any).process.env = { NODE_ENV: 'production' };
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
