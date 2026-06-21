// src/components/producto/catalogo/CatalogHeader.jsx
import React from 'react';

const CatalogHeader = ({ productosSeleccionados = [] }) => {
    return (
        <header className="shop-header">
            <button className="header-icon-button" type="button">☰</button>

            <div className="shop-brand">
                <h1>Carly Shop Qro<span>💕</span></h1>
                <p>Ropa, belleza y oportunidades en Querétaro</p>
            </div>

            <button className="cart-button" type="button">
                🛍️
                {productosSeleccionados.length > 0 && (
                    <span>{productosSeleccionados.length}</span>
                )}
            </button>
        </header>
    );
};

export default CatalogHeader;
