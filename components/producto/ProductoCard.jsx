import React, { useState } from 'react';

// =========================================================
// COMPONENTE: ProductoCard
// =========================================================
const ProductoCard = ({ producto }) => {
    
    // ==========================================================
    // === CONFIGURACIÓN DE HORARIO DE PUJA (Live Time Config) ===
    // Los días se basan en el índice de Date.getDay():
    // 0 = Domingo, 1 = Lunes, 2 = Martes, ..., 6 = Sábado
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
    /**
     * Determina si la hora actual cae dentro del periodo de "live" (puja).
     * Periodo: Sábado (LIVE_START_HOUR) a Martes (hasta LIVE_END_HOUR).
     * @returns {boolean} True si estamos en el horario de live, False en caso contrario.
     */
    const isLiveTime = () => {
        const now = new Date();
        const day = now.getDay(); 
        const hours = now.getHours();

        // Conversión a una escala lineal para manejar el rango Sábado -> Martes
        // 6 (Sáb), 0 (Dom), 1 (Lun), 2 (Mar)
        
        // 1. Caso Sábado: Día de inicio
        if (day === LIVE_START_DAY) { 
            return hours >= LIVE_START_HOUR;
        } 
        
        // 2. Días intermedios: Domingo y Lunes
        // Usamos una lógica de inclusión: 0 y 1 están entre 6 y 2 (en el ciclo semanal)
        if (day === 0 || day === 1) { 
            return true;
        } 
        
        // 3. Caso Martes: Día de fin
        if (day === LIVE_END_DAY) { 
            return hours < LIVE_END_HOUR;
        }
        
        // 4. Cualquier otro día (Miércoles, Jueves, Viernes)
        return false;
    };
    // ============================================================

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
                <p className="product-code">{producto.codigo}</p>

                <p className="product-description-short">{producto.descripcion}</p>
               
               {mostrarLiveSection &&(
                 <span className="real-price">${producto.precio_local.toFixed(2)}</span>)}
               {!mostrarLiveSection &&(
                 <span className="bid-price">${producto.precio_local.toFixed(2)}</span>)}
                <hr />

                {/* Texto de PUJA: (Detalles Clave) 
                    *** CONDICIONAL: Solo se muestra si isLiveTime() es verdadero *** */}
                {mostrarLiveSection && (
                    <div className="bid-section">
                        <span className="bid-label">{codigoPujaInicial}</span>
                        
                        <span className="bid-detail">
                            {tallasTexto}
                        </span> 
                        
                        <span className="bid-price">${producto.precio_live.toFixed(2)}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductoCard;