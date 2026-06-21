import React, { useState } from 'react';

const ProductoCard = ({ producto, isReserved, selected, onToggleSelect, marca }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [mostrarImagenGrande, setMostrarImagenGrande] = useState(false);

    if (!producto) {
        return <div className="product-card">Cargando producto...</div>;
    }

    const fotos = producto.fotos || [];
    const totalFotos = fotos.length;

    const imageUrl = totalFotos > 0
        ? fotos[currentImageIndex]
        : 'https://via.placeholder.com/400x400/F8EEF2/9F6B7D?text=Carly+Shop';

    const precioLocal = Number(
        producto.precio_local ??
        producto.precioVenta ??
        producto.precio ??
        0
    );

    const tallasTexto = producto.tallas && producto.tallas.length > 0
        ? producto.tallas.join(', ')
        : 'Única';

    const nextImage = (event) => {
        if (event) {
            event.stopPropagation();
        }

        if (totalFotos > 1) {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalFotos);
        }
    };

    const prevImage = (event) => {
        if (event) {
            event.stopPropagation();
        }

        if (totalFotos > 1) {
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + totalFotos) % totalFotos);
        }
    };

    const abrirImagenGrande = () => {
        setMostrarImagenGrande(true);
    };

    const cerrarImagenGrande = () => {
        setMostrarImagenGrande(false);
    };

    const cardClass = `
        product-card
        ${selected ? 'product-card-selected' : ''}
        ${isReserved ? 'product-card-reserved' : ''}
    `;

    return (
        <>
            <div className={cardClass}>
                <div className="product-image-wrapper">
          

                    {selected && !isReserved && (
                        <div className="selected-ribbon">
                            Seleccionado
                        </div>
                    )}

                    {isReserved && (
                        <div className="reserved-ribbon">
                            No disponible
                        </div>
                    )}

                    {marca && marca !== 'SIN MARCA' && (
                        <div className="brand-ribbon">
                            {marca}
                        </div>
                    )}

<img
    src={imageUrl}
    alt={producto.descripcion || 'Producto'}
    className="product-image"
/>

<button
    type="button"
    className="product-image-button"
    onClick={abrirImagenGrande}
    title="Ver imagen grande"
>
    🔍 Ver
</button>

                    {totalFotos > 1 && (
                        <>
                            <button
                                type="button"
                                className="carousel-btn prev"
                                onClick={prevImage}
                            >
                                ‹
                            </button>

                            <button
                                type="button"
                                className="carousel-btn next"
                                onClick={nextImage}
                            >
                                ›
                            </button>

                            <div className="carousel-indicator">
                                {currentImageIndex + 1}/{totalFotos}
                            </div>
                        </>
                    )}
                </div>

                <div className="product-info">
                    <h3 className="product-title">
                        {producto.descripcion || 'Producto sin descripción'}
                    </h3>

                    <p className="product-code">
                        {producto.codigo || 'Sin código'}
                    </p>

                    <div className="product-details">
                        <span>{producto.subcategoriaSeleccionada || 'Producto'}</span>
                        <span>Talla: {tallasTexto}</span>
                    </div>

                    <strong className="price-main">
                        ${precioLocal.toFixed(2)} MXN
                    </strong>

                    <button
                        type="button"
                        className={`select-product-btn ${selected ? 'selected' : ''}`}
                        onClick={onToggleSelect}
                        disabled={isReserved}
                    >
                        <span>{marca && marca !== 'SIN MARCA' ? '💬' : '🛍️'}</span>
                        {isReserved
                            ? 'No disponible'
                            : selected
                                ? 'Quitar'
                                : marca && marca !== 'SIN MARCA'
                                    ? 'Consultar'
                                    : 'Seleccionar'}
                    </button>
                </div>
            </div>

            {mostrarImagenGrande && (
                <div className="image-lightbox" onClick={cerrarImagenGrande}>
                    <div
                        className="image-lightbox-content"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="image-lightbox-close"
                            onClick={cerrarImagenGrande}
                        >
                            ×
                        </button>

                        <img
                            src={imageUrl}
                            alt={producto.descripcion || 'Producto'}
                            className="image-lightbox-img"
                        />

                        {totalFotos > 1 && (
                            <>
                                <button
                                    type="button"
                                    className="image-lightbox-arrow left"
                                    onClick={prevImage}
                                >
                                    ‹
                                </button>

                                <button
                                    type="button"
                                    className="image-lightbox-arrow right"
                                    onClick={nextImage}
                                >
                                    ›
                                </button>

                                <div className="image-lightbox-counter">
                                    {currentImageIndex + 1}/{totalFotos}
                                </div>
                            </>
                        )}

                        <div className="image-lightbox-info">
                            <strong>{producto.descripcion || 'Producto'}</strong>
                            <span>{producto.codigo || 'Sin código'}</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductoCard;