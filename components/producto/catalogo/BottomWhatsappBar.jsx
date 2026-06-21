// src/components/producto/catalogo/BottomWhatsappBar.jsx
import React from 'react';

const BottomWhatsappBar = ({
    productosSeleccionados = [],
    abrirModalConsulta
}) => {
    return (
        <button
            type="button"
            className="bottom-whatsapp-bar"
            onClick={abrirModalConsulta}
            disabled={productosSeleccionados.length === 0}
        >
            <span>💬</span>
            Consultar disponibilidad por WhatsApp
            <strong>›</strong>
        </button>
    );
};

export default BottomWhatsappBar;
