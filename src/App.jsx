import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
// Asegúrate de que las rutas a estos componentes sean correctas
import Catalogo from '../components/producto/Catalogo';
import RegistroProducto from '../components/producto/RegistroProducto';

// URL de la API de productos
const API_URL = 'https://neni-system-api-production.up.railway.app/api/productos'; 

// ⬅️ DEFINICIÓN DE CLASIFICACIONES

// 1. Clasificación por GÉNERO / PÚBLICO
const CATEGORIAS_GENERO = [
  'DAMA', 
  'CABALLERO',    
  'INFANTIL',  
];

// 2. Clasificación por TIPO / ESTILO (Incluye 'INTERIOR')
// **NOTA IMPORTANTE:**
// Si en MongoDB guardas 'ROPA_INTERIOR' y aquí usas 'INTERIOR',
// la lógica de filtrado deberá ajustarse para mapear 'INTERIOR' a 'ROPA_INTERIOR'.
// Por ahora, asumiremos que el valor del botón (ej. 'INTERIOR')
// coincide con el valor guardado en 'subcategoriaSeleccionada'.
const SUBCATEGORIAS_TIPO = [
  'ZAPATOS', 
  'ROPA', 
  'DEPORTIVO',
  'INTERIOR', 
  'ACCESORIOS', 
];


function App() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🔄 CAMBIO CLAVE 1: Usamos dos estados para manejar los filtros
  const [filtroGenero, setFiltroGenero] = useState('Ver Todo'); // Fila superior (DAMA, CABALLERO)
  const [filtroTipo, setFiltroTipo] = useState('Ver Todo');     // Fila inferior (ZAPATOS, BLUSAS)

  // Función para cargar los datos del catálogo desde la API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // Hacemos un llamado inicial a la API
        const response = await fetch(API_URL + "/catalogo");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("❌ Error al obtener el catálogo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []); 

  // 🔄 CAMBIO CLAVE 2: Lógica de doble filtrado en el frontend
  const productosFiltrados = productos.filter(producto => {
    let pasaFiltroGenero = true;
    let pasaFiltroTipo = true;

    // 1. FILTRO DE GÉNERO (categoriaBase)
    if (filtroGenero !== 'Ver Todo') {
      // Usamos el campo correcto del modelo de MongoDB: 'categoriaBase'
      pasaFiltroGenero = producto.categoriaBase === filtroGenero;
    }

    // 2. FILTRO DE TIPO (subcategoriaSeleccionada)
    if (filtroTipo !== 'Ver Todo') { 
      // Usamos el campo correcto del modelo de MongoDB: 'subcategoriaSeleccionada'
      // **Asegúrate de que los valores de SUBCATEGORIAS_TIPO coincidan con los de MongoDB.**
      pasaFiltroTipo = producto.subcategoriaSeleccionada === filtroTipo;
    }

    // El producto debe pasar AMBOS filtros (AND lógico)
    return pasaFiltroGenero && pasaFiltroTipo;
  });

  return (
    // ⬅️ CRÍTICO: Este div con ID "app-container" evita el problema de layout con el body flex
    <div id="app-container"> 
      {/* Menú de Navegación (Banner) */}
      <nav className="main-nav">
        
        {/* Enlace 1: CATÁLOGO */}
        <Link 
          to="/" 
          className="nav-link" 
          // 🔄 Ajuste: Al ir al catálogo, reiniciamos los filtros
          onClick={() => {
              setFiltroGenero('Ver Todo');
              setFiltroTipo('Ver Todo');
          }} 
        >
          <i className="fas fa-store"></i>&nbsp;Catálogo
        </Link>
        
        {/* Enlace 2: REGISTRO 
         <Link  
          to="/registro" 
          className="nav-link" 
        >
          <i className="fas fa-plus-circle"></i>&nbsp;Registrar Producto
        </Link>*/}
      </nav>

      {/* Contenido Principal con Altura Mínima */}
      <div id="main-content"> 
        {/* Definición de Rutas */}
        <Routes>
          
          <Route 
            path="/" 
            element={
              <Catalogo 
                productos={productosFiltrados} 
                loading={loading}
                // 🔄 CAMBIO CLAVE 3: Pasamos las funciones y los estados de ambos filtros
                onFiltroGeneroChange={setFiltroGenero}
                onFiltroTipoChange={setFiltroTipo}
                filtroGeneroActivo={filtroGenero}
                filtroTipoActivo={filtroTipo}
                // Pasamos las listas por separado para la doble fila de filtros en Catalogo.jsx
                categoriasGenero={CATEGORIAS_GENERO}
                subcategoriasTipo={SUBCATEGORIAS_TIPO}
              />
            } 
          />
          
          <Route 
            path="/registro" 
            element={
              <RegistroProducto 
                // Pasamos las listas al formulario para los selectores
                categoriasGenero={CATEGORIAS_GENERO}
                subcategoriasTipo={SUBCATEGORIAS_TIPO}
              />
            } 
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;