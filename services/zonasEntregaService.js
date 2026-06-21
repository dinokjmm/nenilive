// src/services/zonasEntregaService.js

import { apiGet } from './apiClient';
import { API_ENDPOINTS } from './apiConfig';

export const obtenerZonasEntrega = async () => {
    return apiGet(API_ENDPOINTS.zonasEntrega);
};

export const obtenerZonasEntregaActivas = async () => {
    return apiGet(`${API_ENDPOINTS.zonasEntrega}/activas`);
};

export const obtenerZonaPorCodigoPostal = async (codigoPostal) => {
    return apiGet(`${API_ENDPOINTS.zonasEntrega}/cp/${codigoPostal}`);
};

export const cotizarEnvioPorCodigoPostal = async (codigoPostal) => {
    return apiGet(`${API_ENDPOINTS.zonasEntrega}/cotizar?codigoPostal=${codigoPostal}`);
};
