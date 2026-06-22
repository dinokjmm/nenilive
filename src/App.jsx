import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import Catalogo from '../components/producto/Catalogo';
import RegistroProducto from '../components/producto/RegistroProducto';

const API_PRODUCTS_URL = 'https://neni-system-api-production.up.railway.app/api/products';
const API_LINKS_URL = 'https://neni-system-api-production.up.railway.app/api/links-catalogo';

const CATEGORIAS_GENERO = [
  'DAMA',
  'CABALLERO',
  'INFANTIL'
];

const SUBCATEGORIAS_TIPO = [
  'ROPA',
  'ZAPATOS',
  'INTERIOR',
  'BELLEZA',
  'PERFUMES',
  'CUIDADO PERSONAL',
  'ACCESORIOS',
  'OTROS'
];

const MARCAS = [
  'NATURA',
  "L'BEL",
  'JAFRA',
  'SIN MARCA'
];

function App() {
  const [productos, setProductos] = useState([]);
  const [linksCatalogo, setLinksCatalogo] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtroGenero, setFiltroGenero] = useState('Ver Todo');
  const [filtroTipo, setFiltroTipo] = useState('Ver Todo');

  const normalizar = (valor) => {
    return String(valor || '').trim().toUpperCase();
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const productosResponse = await fetch(`${API_PRODUCTS_URL}/catalogo`);

        if (!productosResponse.ok) {
          throw new Error(`Error productos: ${productosResponse.status}`);
        }

        const productosData = await productosResponse.json();
        setProductos(Array.isArray(productosData) ? productosData : []);
      } catch (error) {
        console.error('❌ Error al cargar productos:', error);
        setProductos([]);
      }

      try {
        const linksResponse = await fetch(`${API_LINKS_URL}/activos`);

        if (linksResponse.ok) {
          const linksData = await linksResponse.json();
          setLinksCatalogo(Array.isArray(linksData) ? linksData : []);
        } else {
          setLinksCatalogo([]);
        }
      } catch (error) {
        console.error('❌ Error al cargar links de catálogo:', error);
        setLinksCatalogo([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const productosFiltrados = productos.filter((producto) => {
    const esDisponiblePublico =
      normalizar(producto.estatus) === 'DISPONIBLE-PUBLICO';

    let pasaFiltroGenero = true;
    let pasaFiltroTipo = true;

    if (filtroGenero !== 'Ver Todo') {
      pasaFiltroGenero =
        normalizar(producto.categoriaBase) === normalizar(filtroGenero);
    }

    if (filtroTipo !== 'Ver Todo') {
      pasaFiltroTipo =
        normalizar(producto.subcategoriaSeleccionada) === normalizar(filtroTipo);
    }

    return esDisponiblePublico && pasaFiltroGenero && pasaFiltroTipo;
  });

  const linksCatalogosPorCiclo = linksCatalogo.filter(
    link => normalizar(link.tipo) === 'CATALOGO_CICLO'
  );

  const linksTiendasOnline = linksCatalogo.filter(
    link => normalizar(link.tipo) === 'TIENDA_ONLINE'
  );

  return (
    <div id="app-container">
      <div id="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <Catalogo
                productos={productosFiltrados}
                loading={loading}
                onFiltroGeneroChange={setFiltroGenero}
                onFiltroTipoChange={setFiltroTipo}
                filtroGeneroActivo={filtroGenero}
                filtroTipoActivo={filtroTipo}
                categoriasGenero={CATEGORIAS_GENERO}
                subcategoriasTipo={SUBCATEGORIAS_TIPO}
                marcas={MARCAS}
                linksCatalogos={linksCatalogosPorCiclo}
                linksTiendasOnline={linksTiendasOnline}
              />
            }
          />

          <Route
            path="/registro"
            element={
              <RegistroProducto
                categoriasGenero={CATEGORIAS_GENERO}
                subcategoriasTipo={SUBCATEGORIAS_TIPO}
                marcas={MARCAS}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;