// src/components/producto/catalogo/CatalogosExternos.jsx

import React from 'react';

const CatalogosExternos = ({
    linksCatalogos = [],
    linksTiendasOnline = [],
    cargandoLinks = false,
    abrirLinkExterno
}) => {
    return (
        <section id="seccion-catalogos" className="external-links-section section-anchor">
            <div className="external-links-header">
                <div>
                    <h2>Catálogos y tiendas online</h2>
                    <p>Consulta mis catálogos o compra directo en mis links oficiales.</p>
                </div>
                <span>🛍️</span>
            </div>

            {cargandoLinks ? (
                <div className="links-empty">
                    Cargando catálogos y tiendas online...
                </div>
            ) : (
                <>
                    <div className="links-group">
                        <div className="links-group-title">
                            <h3>Catálogos por ciclo</h3>
                            <small>Cambian cada campaña o ciclo</small>
                        </div>

                        {linksCatalogos.length === 0 ? (
                            <div className="links-empty">
                                No hay catálogos configurados por el momento.
                            </div>
                        ) : (
                            <div className="external-links-grid">
                                {linksCatalogos.map((link) => (
                                    <div className="external-link-card" key={link._id || link.id}>
                                        <div className="external-link-icon">
                                            {link.icono || '📖'}
                                        </div>

                                        <div className="external-link-content">
                                            <strong>{link.marca}</strong>
                                            <span>{link.nombre || link.tipo}</span>
                                            <p>{link.descripcion}</p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => abrirLinkExterno(link.url)}
                                        >
                                            Ver catálogo
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="links-group">
                        <div className="links-group-title">
                            <h3>Tiendas online con envío a domicilio</h3>
                            <small>Compra directo en mis links oficiales</small>
                        </div>

                        {linksTiendasOnline.length === 0 ? (
                            <div className="links-empty">
                                No hay tiendas online configuradas por el momento.
                            </div>
                        ) : (
                            <div className="external-links-grid fixed-links">
                                {linksTiendasOnline.map((link) => (
                                    <div
                                        className="external-link-card online-store"
                                        key={link._id || link.id}
                                    >
                                        <div className="external-link-icon">
                                            {link.icono || '🛒'}
                                        </div>

                                        <div className="external-link-content">
                                            <strong>{link.marca}</strong>
                                            <span>{link.nombre || link.tipo}</span>
                                            <p>{link.descripcion}</p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => abrirLinkExterno(link.url)}
                                        >
                                            Comprar en tienda
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </section>
    );
};

export default CatalogosExternos;
