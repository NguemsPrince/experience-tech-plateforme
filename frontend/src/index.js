import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Initialiser Sentry pour le monitoring d'erreurs (optionnel)
// TODO: Installer @sentry/react et @sentry/tracing : npm install @sentry/react @sentry/tracing
// import { initSentry } from './config/sentry';
// initSentry();

// Désactiver les warnings de source-map-loader
const originalConsoleWarn = console.warn;
console.warn = function(...args) {
  if (
    args[0] && 
    typeof args[0] === 'string' && 
    (args[0].includes('Failed to parse source map') || 
     args[0].includes('ENOENT: no such file or directory') ||
     args[0].includes('source-map-loader'))
  ) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // Temporarily disabled StrictMode to prevent double renders and potential reload issues
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

// Désactiver le service worker pour éviter les problèmes de cache
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
  });
}