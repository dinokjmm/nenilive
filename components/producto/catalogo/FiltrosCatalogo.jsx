// src/components/producto/catalogo/FiltrosCatalogo.jsx
import React from 'react';

const FiltrosCatalogo = ({
    busqueda,
    onBusquedaChange,
    filtroTipoActivo,
    filtroMarca,
    limpiarFiltros,
    handleTipoClick,
    handleMarcaClick,
    irASeccion
}) => {
    return (
        <>
            <section id="seccion-productos" className="catalog-title-row section-anchor">
                <h2>Catálogo de productos</h2>
                <span>🛡️ Compra segura y confiable</span>
            </section>

            <div className="catalog-search-box">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    value={busqueda}
                    onChange={onBusquedaChange}
                    placeholder="Buscar por código, marca o producto"
                    className="catalog-search-input"
                />
                <span className="scan-icon">⌗</span>
            </div>

            <section className="top-chips">
                <button
                    className={`top-chip ${filtroTipoActivo === 'Ver Todo' && filtroMarca === 'Ver Todo' ? 'active' : ''}`}
                    onClick={limpiarFiltros}
                >
                    Todo
                </button>

                <button
                    className={`top-chip ${filtroTipoActivo === 'ROPA' ? 'active' : ''}`}
                    onClick={() => handleTipoClick('ROPA')}
                >
                    Ropa
                </button>

                <button
                    className={`top-chip ${filtroTipoActivo === 'ZAPATOS' ? 'active' : ''}`}
                    onClick={() => handleTipoClick('ZAPATOS')}
                >
                    Zapatos
                </button>

                <button
                    className={`top-chip ${filtroMarca === 'NATURA' ? 'active' : ''}`}
                    onClick={() => handleMarcaClick('NATURA')}
                >
                    Natura
                </button>

                <button
                    className={`top-chip ${filtroMarca === "L'BEL" ? 'active' : ''}`}
                    onClick={() => handleMarcaClick("L'BEL")}
                >
                    L&apos;Bel
                </button>

                <button
                    className={`top-chip ${filtroMarca === 'JAFRA' ? 'active' : ''}`}
                    onClick={() => handleMarcaClick('JAFRA')}
                >
                    Jafra
                </button>

                <button
                    className={`top-chip ${filtroTipoActivo === 'ACCESORIOS' ? 'active' : ''}`}
                    onClick={() => handleTipoClick('ACCESORIOS')}
                >
                    Accesorios
                </button>

                <button className="top-chip" onClick={() => irASeccion('seccion-intercambio')}>
                    Intercambio
                </button>
            </section>
        </>
    );
};

export default FiltrosCatalogo;
