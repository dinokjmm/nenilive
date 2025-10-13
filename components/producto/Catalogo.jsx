// src/components/producto/Catalogo.jsx

import React from 'react';
import ProductCard from '../producto/ProductoCard'; // <-- AJUSTA ESTA RUTA si es diferente

// 🔄 CAMBIO CLAVE 1: Recibimos las 4 props de doble filtro de App.js
const Catalogo = ({ 
    productos, 
    loading, 
    // Props de GÉNERO
    onFiltroGeneroChange, 
    filtroGeneroActivo, 
    categoriasGenero, 
    // Props de TIPO
    onFiltroTipoChange, 
    filtroTipoActivo,
    subcategoriasTipo, 
}) => {

    // ❌ Eliminamos la función handleFiltroClick anterior que solo manejaba un filtro
    
    // 🔄 Función para el filtro de GÉNERO
    const handleGeneroClick = (filtro) => {
        // Al hacer clic en un género, reiniciamos el filtro de tipo para ver todos en esa categoría
        onFiltroTipoChange('Ver Todo'); 
        onFiltroGeneroChange(filtro);
    };

    // 🔄 Función para el filtro de TIPO
    const handleTipoClick = (filtro) => {
        // El filtro de género se mantiene, solo cambiamos el filtro de tipo
        onFiltroTipoChange(filtro);
    };

    if (loading) {
        return <h1>Cargando Catálogo...</h1>;
    }

    const totalProductos = productos.length;

    // Determinamos qué filtro está activo para mostrar en el mensaje "No hay productos"
    const filtroActivoGeneral = filtroGeneroActivo !== 'Ver Todo' 
        ? filtroGeneroActivo 
        : (filtroTipoActivo !== 'Ver Todo' ? filtroTipoActivo : 'TODOS');


    return (
        <div>
            <h1>Catálogo en Existencia ({totalProductos})</h1>
            
            {/* ============================================== */}
            {/* === PRIMERA FILA DE FILTROS: GÉNERO / PÚBLICO === */}
            {/* ============================================== */}
            <div className="filter-controls">
                
                {/* Botón de ver todo para GÉNERO */}
                <button 
                    // 🔄 Usamos el estado de GÉNERO
                    className={filtroGeneroActivo === 'Ver Todo' ? 'active' : ''} 
                    onClick={() => handleGeneroClick('Ver Todo')}
                >
                    Ver Todo
                </button>

                {/* Botones de GÉNERO */}
                {categoriasGenero.map((cat) => (
                    <button 
                        key={cat}
                        // 🔄 Usamos el estado de GÉNERO
                        className={filtroGeneroActivo === cat ? 'active' : ''} 
                        // 🔄 Usamos la nueva función
                        onClick={() => handleGeneroClick(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* ============================================== */}
            {/* === SEGUNDA FILA DE FILTROS: TIPO DE PRODUCTO === */}
            {/* ============================================== */}
            <h3 style={{ marginTop: '20px', marginBottom: '10px', color: '#303952' }}>Filtrar por Tipo:</h3>
            <div className="filter-controls" style={{ borderBottom: 'none' }}> 
                
                {/* Botón de ver todo para TIPO */}
                <button 
                    // 🔄 Usamos el estado de TIPO
                    className={filtroTipoActivo === 'Ver Todo' ? 'active' : ''} 
                    onClick={() => handleTipoClick('Ver Todo')}
                >
                    Ver Todo
                </button>

                {/* Botones de TIPO/ESTILO */}
                {subcategoriasTipo.map((cat) => (
                    <button 
                        key={cat}
                        // 🔄 Usamos el estado de TIPO
                        className={filtroTipoActivo === cat ? 'active' : ''} 
                        // 🔄 Usamos la nueva función
                        onClick={() => handleTipoClick(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>


            {/* Muestra el mensaje si no hay productos */}
            {/* 🔄 Usamos la variable consolidada para mostrar el mensaje correcto */}
            {totalProductos === 0 && filtroActivoGeneral !== 'TODOS' && filtroActivoGeneral !== 'Ver Todo' && (
                <p style={{ fontSize: '1.2em', color: '#CC0000', marginTop: '40px' }}>
                    No hay productos registrados con los filtros activos.
                </p>
            )}

            {/* Lista de productos */}
            <div className="product-list">
                {productos.map((producto, index) => (
                    // Asume que tienes un componente ProductCard
                    <ProductCard key={index} producto={producto} /> 
                ))}
            </div>
        </div>
    );
};

export default Catalogo;