// src/components/producto/catalogo/IntercambioSection.jsx
import React, { useState } from 'react';

const IntercambioSection = ({ productosIntercambio = [] }) => {
    const [mostrarModal, setMostrarModal] = useState(false);

    const abrirModal = () => {
        setMostrarModal(true);
    };

    const cerrarModal = () => {
        setMostrarModal(false);
    };

    return (
        <>
            <section id="seccion-intercambio" className="exchange-section section-anchor">
                <div className="exchange-title-row">
                    <h2>
                        <span>🔁</span>
                        Productos aceptables de intercambio
                    </h2>

                    <button
                        type="button"
                        className="exchange-info-button"
                        onClick={abrirModal}
                    >
                        Sujeto a revisión ⓘ
                    </button>
                </div>

                <div className="exchange-grid">
                    {productosIntercambio.map((item) => (
                        <button
                            type="button"
                            className="exchange-card"
                            key={item.id}
                            onClick={abrirModal}
                        >
                            <div>{item.icono}</div>
                            <p>{item.texto}</p>
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    className="exchange-details-button"
                    onClick={abrirModal}
                >
                    Ver detalle de productos aceptados
                </button>
            </section>

            {mostrarModal && (
                <div className="exchange-modal-overlay" onClick={cerrarModal}>
                    <div
                        className="exchange-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="exchange-modal-header">
                            <div>
                                <h3>Productos aceptados para intercambio</h3>
                                <p>
                                    Estos productos se revisan por WhatsApp antes de confirmar el apartado.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="exchange-modal-close"
                                onClick={cerrarModal}
                            >
                                ×
                            </button>
                        </div>

                        <div className="exchange-modal-content">
                            {productosIntercambio.map((categoria) => (
                                <div className="exchange-category" key={categoria.id}>
                                    <h4>
                                        <span>{categoria.icono}</span>
                                        {categoria.texto}
                                    </h4>

                                    {categoria.descripcion && (
                                        <p className="exchange-category-description">
                                            {categoria.descripcion}
                                        </p>
                                    )}

                                    <ul>
                                        {categoria.productos.map((producto) => (
                                            <li key={producto.id}>
                                                <strong>{producto.texto}</strong>

                                                {producto.detalle && (
                                                    <span> — {producto.detalle}</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>

                                    {categoria.nota && (
                                        <div className="exchange-category-note">
                                            {categoria.nota}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div className="exchange-modal-note">
                                Los productos para intercambio se revisan por WhatsApp antes de confirmar el apartado.
                                Deben estar limpios, completos, en buen estado y, si aplica, cerrados y vigentes.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default IntercambioSection;