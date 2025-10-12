import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // ⬅️ Importar el Router

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ⬅️ Usar BrowserRouter aquí */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);