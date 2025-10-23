// src/components/producto/Catalogo.jsx
import React, { useState } from 'react';
import ProductCard from '../producto/ProductoCard'; // <-- AJUSTA ESTA RUTA si es diferente

const Catalogo = ({ 
    productos, 
    loading, 
    onFiltroGeneroChange, 
    filtroGeneroActivo, 
    categoriasGenero, 
    onFiltroTipoChange, 
    filtroTipoActivo,
    subcategoriasTipo, 
}) => {

    const [paginaActual, setPaginaActual] = useState(1);
    const productosPorPagina = 12;

    // 🔹 Calcular índices de paginación
    const indiceFinal = paginaActual * productosPorPagina;
    const indiceInicial = indiceFinal - productosPorPagina;
    const productosPagina = productos.slice(indiceInicial, indiceFinal);

    const totalPaginas = Math.ceil(productos.length / productosPorPagina);

    // 🔹 Cambiar página
    const cambiarPagina = (numero) => {
        setPaginaActual(numero);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleGeneroClick = (filtro) => {
        onFiltroTipoChange('Ver Todo'); 
        onFiltroGeneroChange(filtro);
        setPaginaActual(1);
    };

    const handleTipoClick = (filtro) => {
        onFiltroTipoChange(filtro);
        setPaginaActual(1);
    };

    if (loading) {
        return <h1>Cargando Catálogo...</h1>;
    }

    const totalProductos = productos.length;

    const filtroActivoGeneral = filtroGeneroActivo !== 'Ver Todo' 
        ? filtroGeneroActivo 
        : (filtroTipoActivo !== 'Ver Todo' ? filtroTipoActivo : 'TODOS');

    // 🔹 Render de los botones de paginación (reutilizable)
    const renderPaginacion = () => (
        totalPaginas > 1 && (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '10px 0 20px',
                flexWrap: 'wrap',
                gap: '4px'
            }}>
                <button 
                    onClick={() => cambiarPagina(paginaActual - 1)} 
                    disabled={paginaActual === 1}
                    style={{
                        padding: '4px 8px',
                        borderRadius: '50%',
                        border: '1px solid #ccc',
                        background: paginaActual === 1 ? '#eee' : '#333',
                        color: paginaActual === 1 ? '#999' : '#fff',
                        cursor: paginaActual === 1 ? 'default' : 'pointer'
                    }}
                >
                    ‹
                </button>

                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                    <button 
                        key={num} 
                        onClick={() => cambiarPagina(num)} 
                        style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            border: '1px solid #ccc',
                            background: num === paginaActual ? '#333' : '#f8f8f8',
                            color: num === paginaActual ? '#fff' : '#333',
                            fontSize: '14px',
                            cursor: 'pointer',
                        }}
                    >
                        {num}
                    </button>
                ))}

                <button 
                    onClick={() => cambiarPagina(paginaActual + 1)} 
                    disabled={paginaActual === totalPaginas}
                    style={{
                        padding: '4px 8px',
                        borderRadius: '50%',
                        border: '1px solid #ccc',
                        background: paginaActual === totalPaginas ? '#eee' : '#333',
                        color: paginaActual === totalPaginas ? '#999' : '#fff',
                        cursor: paginaActual === totalPaginas ? 'default' : 'pointer'
                    }}
                >
                    ›
                </button>
            </div>
        )
    );

    return (
        <div>
            <h2>Catálogo en Existencia ({totalProductos})</h2>

            {/* === FILTROS GÉNERO === */}
<div className="filter-controls">
  {/* Botón Ver Todo */}
  <button 
    className={`filter-chip ${filtroGeneroActivo === 'Ver Todo' ? 'active' : ''}`} 
    onClick={() => handleGeneroClick('Ver Todo')}
  >
    Ver Todo
  </button>

  {/* Botones de cada categoría */}
  {categoriasGenero.map((cat) => (
    <button 
      key={cat}
      className={`filter-chip ${filtroGeneroActivo === cat ? 'active' : ''}`} 
      onClick={() => handleGeneroClick(cat)}
    >
      {cat}
    </button>
  ))}

            </div>

            {/* === FILTROS TIPO === */}
<h3 className="filter-title">Filtrar por Tipo:</h3>
<div className="filter-controls no-border">
  {/* Botón Ver Todo */}
  <button 
    className={`filter-chip ${filtroTipoActivo === 'Ver Todo' ? 'active' : ''}`} 
    onClick={() => handleTipoClick('Ver Todo')}
  >
    Ver Todo
  </button>

  {/* Botones de cada subcategoría */}
  {subcategoriasTipo.map((cat) => (
    <button 
      key={cat}
      className={`filter-chip ${filtroTipoActivo === cat ? 'active' : ''}`} 
      onClick={() => handleTipoClick(cat)}
    >
      {cat}
    </button>
  ))}
</div>

            {/* === PAGINACIÓN ARRIBA === */}
            {renderPaginacion()}

            {/* === MENSAJE SIN PRODUCTOS === */}
            {totalProductos === 0 && filtroActivoGeneral !== 'TODOS' && filtroActivoGeneral !== 'Ver Todo' && (
                <p style={{ fontSize: '1.2em', color: '#CC0000', marginTop: '40px' }}>
                    No hay productos registrados con los filtros activos.
                </p>
            )}

            {/* === LISTA DE PRODUCTOS === */}
            <div className="product-list">
                {productosPagina.map((producto, index) => (
                    <ProductCard key={index} producto={producto} /> 
                ))}
            </div>

            {/* === PAGINACIÓN ABAJO === */}
            {renderPaginacion()}
        </div>
    );
};

export default Catalogo;
