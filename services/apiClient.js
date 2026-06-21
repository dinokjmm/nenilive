// src/services/apiClient.js

import { API_BASE_URL } from './apiConfig';

const construirUrl = (endpoint) => {
    return `${API_BASE_URL}${endpoint}`;
};

const obtenerDetalleError = async (response) => {
    try {
        const errorData = await response.json();
        return errorData.message || errorData.detail || '';
    } catch (error) {
        return '';
    }
};

export const apiGet = async (endpoint) => {
    const response = await fetch(construirUrl(endpoint));

    if (!response.ok) {
        const detail = await obtenerDetalleError(response);
        throw new Error(detail || `Error en petición GET: ${endpoint}`);
    }

    return response.json();
};

export const apiPost = async (endpoint, body) => {
    const response = await fetch(construirUrl(endpoint), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const detail = await obtenerDetalleError(response);
        throw new Error(detail || `Error en petición POST: ${endpoint}`);
    }

    return response.json();
};

export const apiPut = async (endpoint, body) => {
    const response = await fetch(construirUrl(endpoint), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const detail = await obtenerDetalleError(response);
        throw new Error(detail || `Error en petición PUT: ${endpoint}`);
    }

    return response.json();
};

export const apiDelete = async (endpoint) => {
    const response = await fetch(construirUrl(endpoint), { method: 'DELETE' });

    if (!response.ok) {
        const detail = await obtenerDetalleError(response);
        throw new Error(detail || `Error en petición DELETE: ${endpoint}`);
    }

    return response.json();
};
