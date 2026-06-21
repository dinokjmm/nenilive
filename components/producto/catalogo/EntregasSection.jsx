// src/components/producto/catalogo/EntregasSection.jsx
import React from 'react';

const EntregasSection = ({
    calendarioEntregas = [],
    cargandoPuntosEntrega = false
}) => {
    return (
        <section id="seccion-entregas" className="delivery-section section-anchor">
            <h2>
                <span>🗓️</span>
                Calendario de entregas
            </h2>

            {cargandoPuntosEntrega ? (
                <div className="links-empty">Cargando puntos de entrega...</div>
            ) : calendarioEntregas.length === 0 ? (
                <div className="links-empty">No hay puntos de entrega activos por el momento.</div>
            ) : (
                <div className="delivery-grid">
                    {calendarioEntregas.map((item) => (
                        <div className="delivery-card" key={item.id}>
                            <div className="delivery-icon">{item.icono}</div>
                            <div>
                                <strong>{item.dia}</strong>
                                <p>{item.lugar}</p>
                                <small>{item.hora}</small>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default EntregasSection;
