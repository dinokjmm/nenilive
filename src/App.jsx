// src/App.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Asegúrate de reemplazar esta URL con la URL FINAL de tu API en RAILWAY (ej: https://[dominio].railway.app)
const API_URL = 'https://neni-system-api-production.up.railway.app/api/productos'; 

function App() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // Llamada a la API que ya funciona
        const response = await axios.get(`${API_URL}/catalogo`);
        setProductos(response.data);
      } catch (err) {
        console.error('Error al cargar el catálogo:', err);
        setError("Error al cargar los datos. Verifica la API.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []); // El array vacío [] asegura que se ejecute solo una vez al inicio

  if (loading) return <div>Cargando Catálogo...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Catálogo en Existencia ({productos.length})</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        {productos.length > 0 ? (
          productos.map(p => (
            <div key={p.codigo} style={cardStyle}>
              <img src={p.fotos[0] || 'placeholder.jpg'} alt={p.descripcion} style={imgStyle} />
              <h2>{p.codigo} - {p.descripcion}</h2>
              <p style={{ fontWeight: 'bold', color: '#007bff' }}>
                Precio: ${p.precio_local.toFixed(2)}
              </p>
              {/* Ocultamos el estatus, solo mostramos el precio y el código */}
              <p style={{ fontSize: '0.8em', color: '#666' }}>Tallas: {p.tallas}</p>
            </div>
          ))
        ) : (
          <div>¡Vaya! No hay productos disponibles en este momento.</div>
        )}
      </div>
    </div>
  );
}

// Estilos básicos para hacerlo móvil-friendly
const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '10px',
  textAlign: 'center',
};

const imgStyle = {
  width: '100%',
  height: 'auto',
  borderRadius: '4px',
  marginBottom: '10px'
};

export default App;