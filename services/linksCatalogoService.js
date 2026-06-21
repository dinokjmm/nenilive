// src/services/linksCatalogoService.js

import { apiGet } from './apiClient';
import { API_ENDPOINTS } from './apiConfig';

export const obtenerLinksCatalogoActivos = async () => {
    return apiGet(`${API_ENDPOINTS.linksCatalogo}/activos`);
};

export const obtenerLinksCatalogoSeparados = async () => {
    const links = await obtenerLinksCatalogoActivos();
    const lista = Array.isArray(links) ? links : [];

    return {
        linksCatalogos: lista.filter((link) => link.tipo === 'CATALOGO_CICLO'),
        linksTiendasOnline: lista.filter((link) => link.tipo === 'TIENDA_ONLINE')
    };
};
