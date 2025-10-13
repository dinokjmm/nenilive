import React, { useState } from 'react';

// =========================================================
// COMPONENTE: ProductoCard
// =========================================================
const ProductoCard = ({ producto }) => {
    
    // === FIX 1: Verificación de seguridad para la prop 'producto' ===
    // Evita el error "Cannot read properties of undefined (reading 'fotos')"
    if (!producto) {
        // Retorna un placeholder simple si el producto es nulo o indefinido.
        return <div className="product-card">Cargando datos del producto...</div>; 
    }

    // --- FUNCIÓN: FORMATO DE CÓDIGO CORTO PARA LA PUJA ---
    /**
     * Transforma un código completo (ej: Z-DZAP-0001) a un formato corto (ej: DZAP-1).
     * @param {string} fullCode Código completo del producto.
     * @returns {string} Código simplificado.
     */
    const formatCodigoCorto = (fullCode) => {
        if (!fullCode) return '';
        
        // 1. Divide el código por el guion '-'
        const parts = fullCode.split('-'); 
        
        // Aseguramos que haya al menos tres partes (Prefijo-Categoría-Número)
        if (parts.length < 3) {
            return fullCode;
        }

        // El prefijo de subcategoría (ej: DZAP) es la segunda parte (índice 1)
        const subcategoryPrefix = parts[1];
        
        // El número consecutivo (ej: 0001) es la tercera parte (índice 2)
        const numericPart = parts[2];

        // 2. Convierte el número a entero y luego a string para eliminar los ceros a la izquierda
        // Ejemplo: "0001" -> 1 -> "1"
        const simplifiedNumber = parseInt(numericPart, 10).toString();

        // 3. Reensambla el código en el formato corto: DZAP-1
        return `${subcategoryPrefix} ${simplifiedNumber}`;
    };
    // -----------------------------------------------------------

    // Genera el código corto inicial, que ahora se usa directamente en el render
    const codigoPujaInicial = formatCodigoCorto(producto.codigo);

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
    // const categoriaTexto = producto.categoriaBase || 'N/A'; // No utilizada en el render actual
    // const subcategoriaTexto = producto.subcategoriaSeleccionada || 'N/A'; // No utilizada en el render actual
    


    return (
        <div className="product-card">
            
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
                        {/* Botones y clases del carrusel que funcionan con el CSS */}
                        <button className="carousel-btn prev" onClick={prevImage}>{'<'}</button>
                        <button className="carousel-btn next" onClick={nextImage}>{'>'}</button>
                        
                        {/* Indicador de página */}
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
                <span className="real-price">${producto.precio_local.toFixed(2)}</span>

                <hr />

                {/* Texto de PUJA: (Detalles Clave) */}
                <div className="bid-section">
                    <span className="bid-label">PUJA:</span>
                    <span className="bid-detail">
                        {/* Muestra el código corto estático y las tallas */}
                        {codigoPujaInicial} {tallasTexto}
                    </span>
                    <span className="bid-price">${producto.precio_live.toFixed(2)}</span>
                </div>

                {/* Bloque de categorías (comentado) */}
            </div>
        </div>
    );
};

export default ProductoCard;
