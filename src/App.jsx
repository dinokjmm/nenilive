 
// Asegúrate de reemplazar esta URL con la URL FINAL de tu API en RAILWAY (ej: https://[dominio].railway.app)
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // ⬅️ Importar elementos de routing
import Catalogo from '../components/producto/Catalogo'; // ⬅️ (Tu componente actual que lista productos)
import RegistroProducto from '../components/producto/RegistroProducto';

// Nota: Tu componente de listado de productos debe ser algo como 'Catalogo' o 'Home'

const API_URL = 'https://neni-system-api-production.up.railway.app/api/productos'; 
// Asume que tienes un estado y función de fetch para tu catálogo

function App() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para cargar los datos del catálogo
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(API_URL+"/catalogo");
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener el catálogo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []); // Se ejecuta solo una vez al inicio

  return (
    <div>
      {/* Menú de Navegación */}
      <nav style={{ padding: '10px', background: '#f0f0f0' }}>
       </nav>

      <div style={{ padding: '20px' }}>
        {/* Definición de Rutas */}
        <Routes>
          {/* 1. Ruta principal: Muestra el Catálogo */}
          <Route 
            path="/" 
            element={<Catalogo productos={productos} loading={loading} />} 
          />
          
          {/* 2. Ruta para el Formulario: Muestra el Registro */}
          <Route 
            path="/registro" 
            element={<RegistroProducto />} 
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;