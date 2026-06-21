// src/components/producto/hooks/useLinksCatalogo.js

import { useEffect, useState } from 'react';
import { obtenerLinksCatalogoSeparados } from '../../../services/linksCatalogoService';

const useLinksCatalogo = () => {
    const [linksCatalogos, setLinksCatalogos] = useState([]);
    const [linksTiendasOnline, setLinksTiendasOnline] = useState([]);
    const [cargandoLinks, setCargandoLinks] = useState(false);
    const [errorLinks, setErrorLinks] = useState(null);

    const cargarLinks = async () => {
        try {
            setCargandoLinks(true);
            setErrorLinks(null);
            const data = await obtenerLinksCatalogoSeparados();
            setLinksCatalogos(data.linksCatalogos || []);
            setLinksTiendasOnline(data.linksTiendasOnline || []);
        } catch (error) {
            console.error('Error al cargar links de catálogo:', error);
            setErrorLinks(error.message || 'Error al cargar links de catálogo');
            setLinksCatalogos([]);
            setLinksTiendasOnline([]);
        } finally {
            setCargandoLinks(false);
        }
    };

    useEffect(() => {
        cargarLinks();
    }, []);

    return {
        linksCatalogos,
        linksTiendasOnline,
        cargandoLinks,
        errorLinks,
        recargarLinks: cargarLinks
    };
};

export default useLinksCatalogo;
