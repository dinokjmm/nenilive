// src/services/puntosEntregaService.js

import { apiGet } from './apiClient';
import { API_ENDPOINTS } from './apiConfig';

export const obtenerPuntosEntrega = async () => {
    return apiGet(API_ENDPOINTS.puntosEntrega);
};

export const obtenerPuntosEntregaActivos = async () => {
    return apiGet(`${API_ENDPOINTS.puntosEntrega}/activos`);
};

export const obtenerPuntosEntregaPorTipo = async (tipo) => {
    return apiGet(`${API_ENDPOINTS.puntosEntrega}/tipo/${tipo}`);
};
