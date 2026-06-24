import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import Catalogo from '../components/producto/Catalogo';
import RegistroProducto from '../components/producto/RegistroProducto';

const API_PRODUCTS_URL = 'https://neni-system-api-production.up.railway.app/api/products';
const API_LINKS_URL = 'https://neni-system-api-production.up.railway.app/api/links-catalogo';
const API_REGLAS_URL = 'https://neni-system-api-production.up.railway.app/api/reglas';

function App() {
  const [productos, setProductos] = useState([]);
  const [linksCatalogo, setLinksCatalogo] = useState([]);
  const [reglasCategorias, setReglasCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtroGenero, setFiltroGenero] = useState('Ver Todo');
  const [filtroTipo, setFiltroTipo] = useState('Ver Todo');

  const normalizar = (valor) => {
    return String(valor || '')
      .trim()
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[’']/g, '');
  };

  const estaActivo = (item) => {
    return item?.activo === true;
  };

  const obtenerArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.reglas)) return data.reglas;
    return [];
  };

  const obtenerFechaHoy = () => {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0');
    const day = String(hoy.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const obtenerDiaSemanaHoy = () => {
    const diasSemana = [
      'DOMINGO',
      'LUNES',
      'MARTES',
      'MIERCOLES',
      'JUEVES',
      'VIERNES',
      'SABADO'
    ];

    return diasSemana[new Date().getDay()];
  };
const descuentoEstaVigente = (descuento) => {
  if (!descuento || descuento.activo !== true) {
    return false;
  }

  const fechaHoy = obtenerFechaHoy();
  const diaSemanaHoy = obtenerDiaSemanaHoy();

  const fechas = Array.isArray(descuento.fechas)
    ? descuento.fechas
    : [];

  const diasSemana = Array.isArray(descuento.diasSemana)
    ? descuento.diasSemana
    : [];

  const rangosFechas = Array.isArray(descuento.rangosFechas)
    ? descuento.rangosFechas
    : [];

  const aplicaPorFecha = fechas.some((fecha) => {
    return String(fecha || '').trim().slice(0, 10) === fechaHoy;
  });

  const aplicaPorDiaSemana = diasSemana.some((dia) => {
    return normalizar(dia) === normalizar(diaSemanaHoy);
  });

  const aplicaPorRangoFecha = rangosFechas.some((rango) => {
    const inicio = String(rango?.inicio || '').trim().slice(0, 10);
    const fin = String(rango?.fin || '').trim().slice(0, 10);

    if (!inicio || !fin) {
      return false;
    }

    return fechaHoy >= inicio && fechaHoy <= fin;
  });

  return aplicaPorFecha || aplicaPorDiaSemana || aplicaPorRangoFecha;
};

  const cargarReglasCategorias = (reglas) => {
    const reglasActivas = reglas
      .filter((regla) => estaActivo(regla))
      .map((regla) => ({
        categoriaBase: regla.categoriaBase,
        descripcion: regla.descripcion,
        subcategorias: Array.isArray(regla.subcategorias)
          ? regla.subcategorias.filter((subcategoria) => estaActivo(subcategoria))
          : []
      }))
      .filter((regla) => regla.categoriaBase);

    setReglasCategorias(reglasActivas);
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
      }

      try {
        const reglasResponse = await fetch(API_REGLAS_URL);

        if (!reglasResponse.ok) {
          throw new Error(`Error reglas: ${reglasResponse.status}`);
        }

        const reglasData = await reglasResponse.json();
        const reglas = obtenerArray(reglasData);

        cargarReglasCategorias(reglas);
      } catch (error) {
        console.error('❌ Error al cargar reglas/categorías:', error);
        setReglasCategorias([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categoriasGenero = reglasCategorias.map((regla) => regla.categoriaBase);

  const subcategoriasTipo = filtroGenero === 'Ver Todo'
    ? []
    : reglasCategorias
        .find((regla) => normalizar(regla.categoriaBase) === normalizar(filtroGenero))
        ?.subcategorias
        ?.map((subcategoria) => subcategoria.nombre) || [];

  const todasSubcategoriasActivas = reglasCategorias.flatMap((regla) => {
    return regla.subcategorias.map((subcategoria) => subcategoria.nombre);
  });

  const descuentosSubcategoria = reglasCategorias.reduce((mapa, regla) => {
    regla.subcategorias.forEach((subcategoria) => {
      const descuento = subcategoria.descuento;

      if (!descuentoEstaVigente(descuento)) {
        return;
      }

      const llave = `${normalizar(regla.categoriaBase)}__${normalizar(subcategoria.nombre)}`;

      mapa[llave] = {
        ...descuento,
        categoriaBase: regla.categoriaBase,
        subcategoria: subcategoria.nombre
      };
    });

    return mapa;
  }, {});

  const productosFiltrados = productos.filter((producto) => {
    const esDisponiblePublico =
      normalizar(producto.estatus) === normalizar('disponible-publico');

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
    link => normalizar(link.tipo) === normalizar('CATALOGO_CICLO')
  );

  const linksTiendasOnline = linksCatalogo.filter(
    link => normalizar(link.tipo) === normalizar('TIENDA_ONLINE')
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
                categoriasGenero={categoriasGenero}
                subcategoriasTipo={subcategoriasTipo}
                descuentosSubcategoria={descuentosSubcategoria}
                linksCatalogos={linksCatalogosPorCiclo}
                linksTiendasOnline={linksTiendasOnline}
              />
            }
          />

          <Route
            path="/registro"
            element={
              <RegistroProducto
                categoriasGenero={categoriasGenero}
                subcategoriasTipo={todasSubcategoriasActivas}
                marcas={[]}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;