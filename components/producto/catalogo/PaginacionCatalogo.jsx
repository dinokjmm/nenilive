// src/components/producto/catalogo/PaginacionCatalogo.jsx
import React from 'react';

const PaginacionCatalogo = ({
    totalPaginas,
    paginaActual,
    cambiarPagina
}) => {
    if (totalPaginas <= 1) {
        return null;
    }

    return (
        <div className="catalog-pagination">
            <button
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
                className="pagination-btn"
            >
                ‹
            </button>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                <button
                    key={num}
                    onClick={() => cambiarPagina(num)}
                    className={`pagination-number ${num === paginaActual ? 'active' : ''}`}
                >
                    {num}
                </button>
            ))}

            <button
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className="pagination-btn"
            >
                ›
            </button>
        </div>
    );
};

export default PaginacionCatalogo;
