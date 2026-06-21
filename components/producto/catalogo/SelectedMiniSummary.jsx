// src/components/producto/catalogo/SelectedMiniSummary.jsx
import React from 'react';

const SelectedMiniSummary = ({
    productosSeleccionados = [],
    totalSeleccionado = 0,
    limpiarSeleccion
}) => {
    if (productosSeleccionados.length === 0) {
        return null;
    }

    return (
        <div className="selected-mini-summary">
            <span>{productosSeleccionados.length} producto(s)</span>
            <strong>Total aprox: ${totalSeleccionado.toFixed(2)}</strong>
            <button onClick={limpiarSeleccion}>Limpiar</button>
        </div>
    );
};

export default SelectedMiniSummary;
