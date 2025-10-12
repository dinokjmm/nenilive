import React, { useState } from 'react';

// Se asume que recibes el producto como prop
const ProductoCard = ({ producto }) => {
  // Estado para rastrear qué imagen del carrusel se está mostrando
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // URLs de imágenes (con un fallback si no hay fotos)
  const fotos = producto.fotos || [];
  const totalFotos = fotos.length;
  
  // URL de la imagen a mostrar
  const imageUrl = totalFotos > 0 
                     ? fotos[currentImageIndex] 
                     : 'https://via.placeholder.com/300x300/CCCCCC/FFFFFF?text=Sin+Foto';

  // Navegación del carrusel
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalFotos);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + totalFotos) % totalFotos);
  };

  // Prepara los textos
  const tallasTexto = producto.tallas && producto.tallas.length > 0 ? producto.tallas.join(', ') : 'Tallas: Única';
  const descripcionCorta = producto.descripcion.length > 50 ? producto.descripcion.substring(0, 50) + '...' : producto.descripcion;
  
  // Manejo de categorías (si están vacías, usamos 'N/A')
  const categoriaTexto = producto.categoria || 'N/A';
  const subcategoriaTexto = producto.subcategoria || 'N/A';

  return (
    <div className="product-card">
        
        {/* === 1. CARRUSEL DE IMÁGENES === */}
        <div className="image-carousel-container">
            <img 
                src={imageUrl} 
                alt={producto.descripcion} 
                className="product-image"
                // Implementación del 'cover' para que sean uniformes
                style={{ objectFit: 'cover', width: '300px', height: '300px' }} 
            />
            
            {/* Controles del carrusel (solo si hay más de una foto) */}
            {totalFotos > 1 && (
                <>
                    <button className="carousel-btn prev" onClick={prevImage}>{"<"}</button>
                    <button className="carousel-btn next" onClick={nextImage}>{">"}</button>
                    <div className="carousel-indicator">
                        {currentImageIndex + 1} / {totalFotos}
                    </div>
                </>
            )}
        </div>

        {/* === 2. INFORMACIÓN DEL PRODUCTO === */}
        <div className="product-info">
            
            {/* Códigos y Descripción */}
            <h3 className="product-code">{producto.codigo}</h3>
            <p className="product-description-short">{descripcionCorta}</p>
            <span className="real-price">${producto.precio_local.toFixed(2)}</span>

            <hr />

            {/* Texto de PUJA: (Detalles Clave) */}
            <div className="bid-section">
                <span className="bid-label">PUJA:</span>
                <span className="bid-detail">
                    {producto.codigo} {tallasTexto}
                </span>
                <span className="bid-price">${producto.precio_live.toFixed(2)}</span>
            </div>

            {/* Categorías (para entendimiento) */}
            <div className="category-details">
                <p>Categoría: **{categoriaTexto}**</p>
                {subcategoriaTexto !== 'N/A' && <p>Subcategoría: {subcategoriaTexto}</p>}
            </div>
            
            {/* Aquí podrías agregar más detalles como stock, estatus, etc. */}
        </div>
    </div>
  );
};

export default ProductoCard;