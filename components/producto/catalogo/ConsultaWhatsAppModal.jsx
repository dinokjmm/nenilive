// src/components/producto/catalogo/ConsultaWhatsAppModal.jsx
import React from 'react';

const ConsultaWhatsAppModal = ({
    mostrarModalConsulta,
    onClose,
    productosSeleccionados = [],
    totalSeleccionado = 0,
    opcionesEntrega = [],
    formaEntrega,
    setFormaEntrega,
    otraEntrega,
    setOtraEntrega,
    codigoPostal,
    setCodigoPostal,
    cotizarPorCodigoPostal,
    cotizacionEnvio,
    setCotizacionEnvio,
    cotizandoEnvio,
    tieneIntercambio,
    setTieneIntercambio,
    aceptaReglasIntercambio,
    setAceptaReglasIntercambio,
    puntoEntregaSeleccionado,
    setPuntoEntregaSeleccionado,
    puntosEntregaSemanal = [],
    enviarConsultaWhatsApp
}) => {
    if (!mostrarModalConsulta) {
        return null;
    }

    return (
        <div className="consulta-modal-overlay">
            <div className="consulta-modal">
                <button
                    type="button"
                    className="consulta-modal-close"
                    onClick={onClose}
                >
                    ×
                </button>

                <h2>Antes de enviar por WhatsApp</h2>

                <p className="consulta-modal-subtitle">
                    Completa estos datos para mandarme tu consulta más clara.
                </p>

                <div className="consulta-resumen">
                    <strong>{productosSeleccionados.length} producto(s) seleccionados</strong>
                    <span>Total aprox: ${totalSeleccionado.toFixed(2)}</span>
                </div>

                <div className="consulta-field">
                    <label>Forma de entrega</label>

                    <div className="consulta-options">
                        {opcionesEntrega.map((opcion) => (
                            <label
                                key={opcion.id}
                                className={`consulta-option ${formaEntrega === opcion.id ? 'active' : ''}`}
                            >
                                <input
                                    type="radio"
                                    name="formaEntrega"
                                    value={opcion.id}
                                    checked={formaEntrega === opcion.id}
                                    onChange={() => {
                                        setFormaEntrega(opcion.id);
                                        setCotizacionEnvio(null);
                                        setPuntoEntregaSeleccionado('');
                                        setOtraEntrega('');
                                        setCodigoPostal('');
                                    }}
                                />

                                <div>
                                    <strong>{opcion.nombre}</strong>
                                    <p>{opcion.descripcion}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {formaEntrega === 'PUNTO_SEMANAL' && (
                    <div className="consulta-field">
                        <label>Selecciona el punto de entrega</label>

                        {puntosEntregaSemanal.length === 0 ? (
                            <div className="delivery-empty compact">
                                <p>No hay puntos de entrega configurados.</p>
                                <small>Puedes elegir otra opción o consultar por WhatsApp.</small>
                            </div>
                        ) : (
                            <div className="weekly-delivery-options">
                                {puntosEntregaSemanal.map((item) => (
                                    <label
                                        key={item.id}
                                        className={`weekly-delivery-option ${
                                            String(puntoEntregaSeleccionado) === String(item.id) ? 'active' : ''
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="puntoEntregaSemanal"
                                            value={item.id}
                                            checked={String(puntoEntregaSeleccionado) === String(item.id)}
                                            onChange={() => setPuntoEntregaSeleccionado(item.id)}
                                        />

                                        <div className="weekly-delivery-icon">
                                            {item.icono || '📍'}
                                        </div>

                                        <div className="weekly-delivery-info">
                                            <strong>{item.dia}</strong>
                                            <p>{item.lugar}</p>
                                            <small>{item.hora}</small>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {formaEntrega === 'DOMICILIO' && (
                    <div className="consulta-field">
                        <label>Código postal para cotizar envío</label>

                        <input
                            type="text"
                            value={codigoPostal}
                            maxLength="5"
                            placeholder="Ej. 76116"
                            className="consulta-input"
                            onChange={(event) => {
                                const value = event.target.value.replace(/\D/g, '');
                                setCodigoPostal(value);
                                setCotizacionEnvio(null);

                                if (value.length === 5) {
                                    cotizarPorCodigoPostal(value);
                                }
                            }}
                        />

                        <small className="consulta-help">
                            Entrega a domicilio solo en Querétaro, Qro. Domingos de 4:00 pm a 7:00 pm. Costo mínimo $50.
                        </small>

                        {cotizandoEnvio && (
                            <div className="cotizacion-box">
                                Cotizando envío...
                            </div>
                        )}

                        {!cotizandoEnvio && cotizacionEnvio && (
                            <div className={`cotizacion-box ${cotizacionEnvio.encontrado ? 'success' : 'warning'}`}>
                                {cotizacionEnvio.encontrado ? (
                                    <>
                                        <strong>Envío aproximado:</strong>
                                        {' '}
                                        ${Number(cotizacionEnvio.costoEntrega || 0).toFixed(2)}
                                        {cotizacionEnvio.zona && (
                                            <span> | Zona: {cotizacionEnvio.zona}</span>
                                        )}
                                    </>
                                ) : (
                                    <span>{cotizacionEnvio.mensaje || 'CP no registrado. Se cotiza por WhatsApp.'}</span>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {formaEntrega === 'OTRA' && (
                    <div className="consulta-field">
                        <label>Describe la forma de entrega que quieres consultar</label>

                        <textarea
                            value={otraEntrega}
                            className="consulta-textarea"
                            placeholder="Ej. Me gustaría ver si puede ser cerca de..."
                            onChange={(event) => setOtraEntrega(event.target.value)}
                        />
                    </div>
                )}

                <div className="consulta-field">
                    <label>Tengo productos para intercambio</label>

                    <div className="consulta-switch-row">
                        <button
                            type="button"
                            className={`switch-btn ${tieneIntercambio === 'NO' ? 'active' : ''}`}
                            onClick={() => {
                                setTieneIntercambio('NO');
                                setAceptaReglasIntercambio(false);
                            }}
                        >
                            No
                        </button>

                        <button
                            type="button"
                            className={`switch-btn ${tieneIntercambio === 'SI' ? 'active' : ''}`}
                            onClick={() => setTieneIntercambio('SI')}
                        >
                            Sí
                        </button>
                    </div>
                </div>

                {tieneIntercambio === 'SI' && (
                    <div className="exchange-rules-box">
                        <strong>Reglas para intercambio</strong>

                        <ul>
                            <li>Solo se aceptan productos indicados como aceptables en la página.</li>
                            <li>No se aceptan productos rotos, dañados, sucios, manchados, abiertos sin revisar o incompletos.</li>
                            <li>El producto debe estar vigente, en buen estado y con contenido completo.</li>
                            <li>Para productos de catálogo, el valor de intercambio se toma sobre el precio de catálogo actual al público.</li>
                            <li>El precio de consultora solo aplica si manejamos el mismo nivel o descuento equivalente.</li>
                            <li>Todo producto se revisa antes de confirmar el intercambio.</li>
                            <li>El valor final del intercambio se confirma por WhatsApp.</li>
                        </ul>

                        <label className="rules-check">
                            <input
                                type="checkbox"
                                checked={aceptaReglasIntercambio}
                                onChange={(event) => setAceptaReglasIntercambio(event.target.checked)}
                            />
                            Entiendo y acepto las reglas de revisión para intercambio.
                        </label>
                    </div>
                )}

                <button
                    type="button"
                    className="consulta-send-btn"
                    onClick={enviarConsultaWhatsApp}
                >
                    Enviar consulta por WhatsApp
                </button>
            </div>
        </div>
    );
};

export default ConsultaWhatsAppModal;
