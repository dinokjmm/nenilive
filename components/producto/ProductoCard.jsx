import React, { useState } from 'react';

// =========================================================
// COMPONENTE: ProductoCard
// Se añade 'isReserved' a las props
// =========================================================
const ProductoCard = ({ producto, isReserved }) => {
    
    // ==========================================================
    // === CONFIGURACIÓN DE HORARIO DE PUJA (Live Time Config) ===
    // ==========================================================
    const LIVE_START_DAY = 6;      // Sábado
    const LIVE_START_HOUR = 9;     // 9:00 am (inclusive)

    const LIVE_END_DAY = 2;        // Martes
    const LIVE_END_HOUR = 22;      // 12:00 pm (exclusive)
    // ==========================================================
    
    // === FIX 1: Verificación de seguridad para la prop 'producto' ===
    if (!producto) {
        return <div className="product-card">Cargando datos del producto...</div>; 
    }

    // --- FUNCIÓN: FORMATO DE CÓDIGO CORTO PARA LA PUJA ---
    const formatCodigoCorto = (fullCode) => {
        if (!fullCode) return '';
        
        const parts = fullCode.split('-'); 
        
        if (parts.length < 3) {
            return fullCode;
        }

        const subcategoryPrefix = parts[1];
        const numericPart = parts[2];
        const simplifiedNumber = parseInt(numericPart, 10).toString();

        return `${subcategoryPrefix}-${simplifiedNumber}`; 
    };
    // -----------------------------------------------------------

    // === FUNCIÓN: VALIDACIÓN POR HORARIO USANDO LAS CONSTANTES ===
    const isLiveTime = () => {
        const now = new Date();
        const day = now.getDay(); 
        const hours = now.getHours();

        if (day === LIVE_START_DAY) { 
            return hours >= LIVE_START_HOUR;
        } 
        
        if (day === 0 || day === 1) { 
            return true;
        } 
        
        if (day === LIVE_END_DAY) { 
            return hours < LIVE_END_HOUR;
        }
        
        return false;
    };
    // ============================================================

    // El estado de 'apartado' se recibe directamente por props (isReserved)
    const codigoPujaInicial = formatCodigoCorto(producto.codigo);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const fotos = producto.fotos || [];
    const totalFotos = fotos.length;
    
    const imageUrl = totalFotos > 0 
                                ? fotos[currentImageIndex] 
                                : 'https://via.placeholder.com/300x300/CCCCCC/FFFFFF?text=Sin+Foto';

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalFotos);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + totalFotos) % totalFotos);
    };

    const tallasTexto = producto.tallas && producto.tallas.length > 0 ? producto.tallas.join(', ') : 'Tallas: Única';
    
    // Ejecutar la validación del horario
    const mostrarLiveSection = isLiveTime();

    // === CLASES CONDICIONALES PARA EL CARD ===
    // Utiliza la prop isReserved
    const cardClass = `product-card ${isReserved ? 'product-card--reserved' : ''}`;
    // =========================================

    return (
        <div className={cardClass}>
            
            {/* Indicador de APARTADO (Overlay) - Utiliza la prop isReserved */}
            {isReserved && (
                <div className="product-card-overlay">
                    <span className="product-card-badge">APARTADO</span>
                </div>
            )}

            {/* === 1. CARRUSEL DE IMÁGENES === */}
            <div className="image-carousel-container">
                <img 
                    src={imageUrl} 
                    alt={producto.descripcion} 
                    className="product-image"
                />
                
                {/* Controles del carrusel (solo si hay más de una foto) */}
                {totalFotos > 1 && (
                    <>
                        <button className="carousel-btn prev" onClick={prevImage}>{'<'}</button>
                        <button className="carousel-btn next" onClick={nextImage}>{'>'}</button>
                        
                        <div className="carousel-indicator">
                            {currentImageIndex + 1} / {totalFotos}
                        </div>
                    </>
                )}
            </div>

            {/* === 2. INFORMACIÓN DEL PRODUCTO === */}
            <div className="product-info">
                 <p className="product-description-short"> CODIGO: {producto.codigo} <br /> {producto.descripcion}</p>
                {/* Precio local con tachado condicional */}
                <span className={`real-price ${isReserved ? 'price--strikethrough' : ''}`}>
                    ${producto.precio_local.toFixed(2)}
                </span>

                <hr />

                {/* === BLOQUE DE PRECIO DE PUJA/LIVE === */}
                {mostrarLiveSection ? (
                    <div className="bid-section">
                        {/* El texto del código de puja ahora incluye el estado de apartado */}
                        <span className="bid-label">
                            {isReserved && <span className="reserved-indicator"> (APARTADO)</span>}
                        </span>
                        
                        <span className="bid-detail">
                            {tallasTexto}
                        </span> 
                        
                        <span className="bid-price">${producto.precio_live.toFixed(2)}</span>
                    </div>
                ) : (
                    /* Muestra solo el precio en vivo sin formato de puja cuando NO es horario de live */
                    <div className="bid-section--inactive">
                        <span className="bid-price bid-price--inactive">
                            ${producto.precio_live.toFixed(2)}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductoCard;