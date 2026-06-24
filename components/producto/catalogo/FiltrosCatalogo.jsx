// src/components/producto/catalogo/FiltrosCatalogo.jsx
import React from 'react';

const FiltrosCatalogo = ({
    busqueda,
    onBusquedaChange,
    filtroGeneroActivo,
    filtroTipoActivo,
    limpiarFiltros,
    handleGeneroClick,
    handleTipoClick,
    irASeccion,
    categoriasGenero = [],
    subcategoriasTipo = []
}) => {
    const normalizar = (valor) => {
        return String(valor || '')
            .trim()
            .toUpperCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[’']/g, '');
    };

    const esGeneroActivo = (categoria) => {
        return normalizar(filtroGeneroActivo) === normalizar(categoria);
    };

    const esTipoActivo = (subcategoria) => {
        return normalizar(filtroTipoActivo) === normalizar(subcategoria);
    };

    const estaTodoActivo =
        normalizar(filtroGeneroActivo) === normalizar('Ver Todo') &&
        normalizar(filtroTipoActivo) === normalizar('Ver Todo');

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
                    placeholder="Buscar por código o producto"
                    className="catalog-search-input"
                />
                <span className="scan-icon">⌗</span>
            </div>

            <section className="catalog-filters">
                <div className="top-chips">
                    <button
                        className={`top-chip ${estaTodoActivo ? 'active' : ''}`}
                        onClick={limpiarFiltros}
                    >
                        Todo
                    </button>

                    <button
                        className="top-chip"
                        onClick={() => irASeccion('seccion-intercambio')}
                    >
                        Intercambio
                    </button>
                </div>

                {categoriasGenero.length > 0 && (
                    <details className="filter-collapse" open>
                        <summary>
                            Categorías
                            <span>{categoriasGenero.length}</span>
                        </summary>

                        <div className="top-chips">
                            {categoriasGenero.map((categoria) => (
                                <button
                                    key={categoria}
                                    className={`top-chip ${esGeneroActivo(categoria) ? 'active' : ''}`}
                                    onClick={() => handleGeneroClick(categoria)}
                                >
                                    {categoria}
                                </button>
                            ))}
                        </div>
                    </details>
                )}

                {normalizar(filtroGeneroActivo) !== normalizar('Ver Todo') && subcategoriasTipo.length > 0 && (
                    <details className="filter-collapse" open>
                        <summary>
                            Subcategorías de {filtroGeneroActivo}
                            <span>{subcategoriasTipo.length}</span>
                        </summary>

                        <div className="top-chips">
                            {subcategoriasTipo.map((subcategoria) => (
                                <button
                                    key={subcategoria}
                                    className={`top-chip ${esTipoActivo(subcategoria) ? 'active' : ''}`}
                                    onClick={() => handleTipoClick(subcategoria)}
                                >
                                    {subcategoria}
                                </button>
                            ))}
                        </div>
                    </details>
                )}
            </section>
        </>
    );
};

export default FiltrosCatalogo;