// src/components/producto/Catalogo.jsx

import React, { useState } from 'react';
import ProductCard from './ProductoCard';

import CatalogHeader from './catalogo/CatalogHeader';
import PageIndex from './catalogo/PageIndex';
import WhatsappBanner from './catalogo/WhatsappBanner';
import CatalogosExternos from './catalogo/CatalogosExternos';
import FiltrosCatalogo from './catalogo/FiltrosCatalogo';
import EntregasSection from './catalogo/EntregasSection';
import IntercambioSection from './catalogo/IntercambioSection';
import SelectedMiniSummary from './catalogo/SelectedMiniSummary';
import BottomWhatsappBar from './catalogo/BottomWhatsappBar';
import PaginacionCatalogo from './catalogo/PaginacionCatalogo';
import ConsultaWhatsAppModal from './catalogo/ConsultaWhatsAppModal';

import usePuntosEntrega from './hooks/usePuntosEntrega';
import useLinksCatalogo from './hooks/useLinksCatalogo';

import { cotizarEnvioPorCodigoPostal } from '../../services/zonasEntregaService';

import {
    construirCalendarioEntregas,
    filtrarProductosCatalogo,
    obtenerIdProducto,
    obtenerMarca,
    obtenerOpcionesEntregaDefault,
    obtenerPrecio,
    obtenerProductosIntercambioDefault,
    productoEstaSeleccionado,
    productoNoDisponible
} from './catalogo/catalogoUtils';

const Catalogo = ({
    productos,
    loading,
    onFiltroGeneroChange,
    filtroGeneroActivo,
    categoriasGenero,
    onFiltroTipoChange,
    filtroTipoActivo,
    subcategoriasTipo,
    marcas = []
}) => {
    const [paginaActual, setPaginaActual] = useState(1);
    const [busqueda, setBusqueda] = useState('');
    const [filtroMarca, setFiltroMarca] = useState('Ver Todo');
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);

    const [mostrarModalConsulta, setMostrarModalConsulta] = useState(false);
    const [formaEntrega, setFormaEntrega] = useState('');
    const [otraEntrega, setOtraEntrega] = useState('');
    const [codigoPostal, setCodigoPostal] = useState('');
    const [cotizacionEnvio, setCotizacionEnvio] = useState(null);
    const [cotizandoEnvio, setCotizandoEnvio] = useState(false);
    const [tieneIntercambio, setTieneIntercambio] = useState('NO');
    const [aceptaReglasIntercambio, setAceptaReglasIntercambio] = useState(false);
    const [puntoEntregaSeleccionado, setPuntoEntregaSeleccionado] = useState('');

    const productosPorPagina = 8;
    const telefonoWhatsApp = '5214421910093';

    const {
        puntosEntregaBD,
        cargandoPuntosEntrega
    } = usePuntosEntrega();

    const {
        linksCatalogos,
        linksTiendasOnline,
        cargandoLinks
    } = useLinksCatalogo();

    const opcionesEntrega = obtenerOpcionesEntregaDefault();
    const productosIntercambio = obtenerProductosIntercambioDefault();

    const calendarioEntregas = construirCalendarioEntregas(puntosEntregaBD);

    const puntosEntregaSemanal = calendarioEntregas.filter((item) => {
        return item.tipo !== 'DOMICILIO';
    });

    const productosConBusqueda = filtrarProductosCatalogo({
        productos,
        busqueda,
        filtroMarca
    });

    const indiceFinal = paginaActual * productosPorPagina;
    const indiceInicial = indiceFinal - productosPorPagina;
    const productosPagina = productosConBusqueda.slice(indiceInicial, indiceFinal);

    const totalPaginas = Math.ceil(productosConBusqueda.length / productosPorPagina);

    const totalSeleccionado = productosSeleccionados.reduce((total, producto) => {
        return total + obtenerPrecio(producto);
    }, 0);

    const toggleProducto = (producto) => {
        if (productoNoDisponible(producto)) {
            return;
        }

        const id = obtenerIdProducto(producto);

        setProductosSeleccionados((prev) => {
            const yaExiste = prev.some(p => obtenerIdProducto(p) === id);

            if (yaExiste) {
                return prev.filter(p => obtenerIdProducto(p) !== id);
            }

            return [...prev, producto];
        });
    };

    const limpiarSeleccion = () => {
        setProductosSeleccionados([]);
    };

    const abrirLinkExterno = (url) => {
        if (!url) {
            alert('Este link aún no está configurado.');
            return;
        }

        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const abrirModalConsulta = () => {
        if (productosSeleccionados.length === 0) {
            alert('Selecciona al menos un producto.');
            return;
        }

        setMostrarModalConsulta(true);
    };

    const cerrarModalConsulta = () => {
        setMostrarModalConsulta(false);
    };

    const cotizarPorCodigoPostal = async (cp) => {
        const cpLimpio = String(cp || '').trim();

        if (cpLimpio.length !== 5) {
            setCotizacionEnvio(null);
            return;
        }

        try {
            setCotizandoEnvio(true);

            const data = await cotizarEnvioPorCodigoPostal(cpLimpio);
            setCotizacionEnvio(data);
        } catch (error) {
            console.error('Error al cotizar envío:', error);

            setCotizacionEnvio({
                encontrado: false,
                mensaje: 'No se pudo cotizar automáticamente. Se cotiza por WhatsApp.'
            });
        } finally {
            setCotizandoEnvio(false);
        }
    };

    const enviarConsultaWhatsApp = () => {
        if (!formaEntrega) {
            alert('Selecciona una forma de entrega.');
            return;
        }

        if (formaEntrega === 'PUNTO_SEMANAL' && !puntoEntregaSeleccionado) {
            alert('Selecciona un punto de entrega.');
            return;
        }

        if (formaEntrega === 'DOMICILIO' && codigoPostal.trim().length !== 5) {
            alert('Captura un código postal válido de 5 dígitos para cotizar el envío.');
            return;
        }

        if (formaEntrega === 'OTRA' && otraEntrega.trim() === '') {
            alert('Describe la otra forma de entrega que quieres consultar.');
            return;
        }

        if (tieneIntercambio === 'SI' && !aceptaReglasIntercambio) {
            alert('Para intercambio, debes aceptar las reglas de revisión.');
            return;
        }

        const productosTexto = productosSeleccionados
            .map((producto, index) => {
                const codigo = producto.codigo || 'Sin código';
                const descripcion = producto.descripcion || 'Sin descripción';
                const precio = obtenerPrecio(producto).toFixed(2);
                const marca = obtenerMarca(producto);

                const tallas = producto.tallas && producto.tallas.length > 0
                    ? ` | Talla(s): ${producto.tallas.join(', ')}`
                    : '';

                return `${index + 1}. ${codigo} - ${descripcion}${tallas} - ${marca} - $${precio}`;
            })
            .join('\n');

        const opcionEntrega = opcionesEntrega.find(opcion => opcion.id === formaEntrega);

        let entregaTexto = '';

        if (formaEntrega === 'PUNTO_SEMANAL') {
            const punto = puntosEntregaSemanal.find(
                item => String(item.id) === String(puntoEntregaSeleccionado)
            );

            entregaTexto = `Punto de entrega
${punto ? `${punto.dia} - ${punto.lugar} - ${punto.hora}` : 'No especificado'}`;

        } else if (formaEntrega === 'DOMICILIO') {
            const costoTexto = cotizacionEnvio && cotizacionEnvio.encontrado
                ? `$${Number(cotizacionEnvio.costoEntrega || 0).toFixed(2)} aprox.`
                : 'A cotizar por WhatsApp';

            const zonaTexto = cotizacionEnvio && cotizacionEnvio.encontrado && cotizacionEnvio.zona
                ? `Zona: ${cotizacionEnvio.zona}`
                : '';

            entregaTexto = `Entrega a domicilio
Código postal: ${codigoPostal}
${zonaTexto}
Costo de envío: ${costoTexto}
Nota: Solo Querétaro, Qro. Domingo de 4:00 pm a 7:00 pm. Mínimo $50.`;

        } else if (formaEntrega === 'OTRA') {
            entregaTexto = `Otra opción: ${otraEntrega}`;

        } else {
            entregaTexto = `${opcionEntrega?.nombre || 'No especificada'}
${opcionEntrega?.descripcion || ''}`;
        }

        const intercambioTexto = tieneIntercambio === 'SI'
            ? `Sí tengo productos para intercambio.

Acepto que:
- Solo se revisan productos aceptables según la página.
- No se aceptan productos rotos, dañados, sucios, manchados, abiertos sin revisar o incompletos.
- El producto debe estar vigente, en buen estado y con contenido completo.
- Para productos de catálogo, el valor de intercambio se toma sobre el precio de catálogo actual al público.
- El precio de consultora solo aplica si manejamos el mismo nivel o descuento equivalente.
- Todo producto se revisa antes de confirmar el intercambio.
- El valor final del intercambio se confirma por WhatsApp.`
            : 'No tengo productos para intercambio.';

        const mensaje = `Hola Carly, quiero consultar disponibilidad de estos productos:

${productosTexto}

Total productos: $${totalSeleccionado.toFixed(2)}

Forma de entrega:
${entregaTexto}

Intercambio:
${intercambioTexto}

¿Me confirmas disponibilidad y total con costo de envío?`;

        const url = `https://wa.me/${telefonoWhatsApp}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');

        setMostrarModalConsulta(false);
    };

    const cambiarPagina = (numero) => {
        if (numero < 1 || numero > totalPaginas) {
            return;
        }

        setPaginaActual(numero);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleGeneroClick = (filtro) => {
        onFiltroTipoChange('Ver Todo');
        onFiltroGeneroChange(filtro);
        setPaginaActual(1);
    };

    const handleTipoClick = (filtro) => {
        onFiltroTipoChange(filtro);
        setPaginaActual(1);
    };

    const handleMarcaClick = (marca) => {
        setFiltroMarca(marca);
        setPaginaActual(1);
    };

    const handleBusquedaChange = (event) => {
        setBusqueda(event.target.value);
        setPaginaActual(1);
    };

    const limpiarFiltros = () => {
        setBusqueda('');
        setFiltroMarca('Ver Todo');
        handleGeneroClick('Ver Todo');
        handleTipoClick('Ver Todo');
    };

    const irASeccion = (idSeccion) => {
        const seccion = document.getElementById(idSeccion);

        if (seccion) {
            seccion.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    if (loading) {
        return (
            <div className="catalog-loading">
                <div className="loader"></div>
                <p>Cargando catálogo...</p>
            </div>
        );
    }

    return (
        <div className="catalog-page">
            <CatalogHeader productosSeleccionados={productosSeleccionados} />

            <PageIndex irASeccion={irASeccion} />

            <WhatsappBanner />

            <FiltrosCatalogo
                busqueda={busqueda}
                onBusquedaChange={handleBusquedaChange}
                filtroTipoActivo={filtroTipoActivo}
                filtroMarca={filtroMarca}
                limpiarFiltros={limpiarFiltros}
                handleTipoClick={handleTipoClick}
                handleMarcaClick={handleMarcaClick}
                irASeccion={irASeccion}
            />

            {productosConBusqueda.length === 0 ? (
                <div className="empty-catalog">
                    <p>No hay productos con esos filtros.</p>
                    <span>Prueba buscar otra categoría, marca o limpiar filtros.</span>
                </div>
            ) : (
                <div className="product-list">
                    {productosPagina.map((producto, index) => (
                        <ProductCard
                            key={producto._id || producto.codigo || index}
                            producto={producto}
                            isReserved={productoNoDisponible(producto)}
                            selected={productoEstaSeleccionado(producto, productosSeleccionados)}
                            onToggleSelect={() => toggleProducto(producto)}
                            marca={obtenerMarca(producto)}
                        />
                    ))}
                </div>
            )}

            <PaginacionCatalogo
                totalPaginas={totalPaginas}
                paginaActual={paginaActual}
                cambiarPagina={cambiarPagina}
            />

            <EntregasSection
                calendarioEntregas={calendarioEntregas}
                cargandoPuntosEntrega={cargandoPuntosEntrega}
            /><p> </p>
            <CatalogosExternos
                linksCatalogos={linksCatalogos}
                linksTiendasOnline={linksTiendasOnline}
                cargandoLinks={cargandoLinks}
                abrirLinkExterno={abrirLinkExterno}
            />
            <IntercambioSection productosIntercambio={productosIntercambio} />

            

            <BottomWhatsappBar
                productosSeleccionados={productosSeleccionados}
                abrirModalConsulta={abrirModalConsulta}
            />

            <SelectedMiniSummary
                productosSeleccionados={productosSeleccionados}
                totalSeleccionado={totalSeleccionado}
                limpiarSeleccion={limpiarSeleccion}
            />

            <ConsultaWhatsAppModal
                mostrarModalConsulta={mostrarModalConsulta}
                onClose={cerrarModalConsulta}
                productosSeleccionados={productosSeleccionados}
                totalSeleccionado={totalSeleccionado}
                opcionesEntrega={opcionesEntrega}
                formaEntrega={formaEntrega}
                setFormaEntrega={setFormaEntrega}
                otraEntrega={otraEntrega}
                setOtraEntrega={setOtraEntrega}
                codigoPostal={codigoPostal}
                setCodigoPostal={setCodigoPostal}
                cotizarPorCodigoPostal={cotizarPorCodigoPostal}
                cotizacionEnvio={cotizacionEnvio}
                setCotizacionEnvio={setCotizacionEnvio}
                cotizandoEnvio={cotizandoEnvio}
                tieneIntercambio={tieneIntercambio}
                setTieneIntercambio={setTieneIntercambio}
                aceptaReglasIntercambio={aceptaReglasIntercambio}
                setAceptaReglasIntercambio={setAceptaReglasIntercambio}
                puntoEntregaSeleccionado={puntoEntregaSeleccionado}
                setPuntoEntregaSeleccionado={setPuntoEntregaSeleccionado}
                puntosEntregaSemanal={puntosEntregaSemanal}
                enviarConsultaWhatsApp={enviarConsultaWhatsApp}
            />
        </div>
    );
};

export default Catalogo;