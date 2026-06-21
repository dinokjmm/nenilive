// src/components/producto/catalogo/PageIndex.jsx
import React from 'react';

const PageIndex = ({ irASeccion }) => {
    return (
        <section className="page-index">
            <button type="button" onClick={() => irASeccion('seccion-catalogos')}>🛍️ Catálogos</button>
            <button type="button" onClick={() => irASeccion('seccion-productos')}>👚 Productos</button>
            <button type="button" onClick={() => irASeccion('seccion-entregas')}>📍 Entregas</button>
            <button type="button" onClick={() => irASeccion('seccion-intercambio')}>🔁 Intercambio</button>
        </section>
    );
};

export default PageIndex;
