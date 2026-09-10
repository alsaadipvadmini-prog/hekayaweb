import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

window.onerror = function (message, source, lineno, colno, error) {
  console.warn('Global Error caught:', message, error);
  // Optional: Could render a fallback to the DOM directly here if critical
};

window.onunhandledrejection = function (event) {
  console.warn('Unhandled Promise Rejection:', event.reason);
};


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
