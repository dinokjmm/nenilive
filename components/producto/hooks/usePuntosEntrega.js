// src/components/producto/hooks/usePuntosEntrega.js

import { useEffect, useState } from 'react';
import { obtenerPuntosEntregaActivos } from '../../../services/puntosEntregaService';

const usePuntosEntrega = () => {
    const [puntosEntregaBD, setPuntosEntregaBD] = useState([]);
    const [cargandoPuntosEntrega, setCargandoPuntosEntrega] = useState(false);
    const [errorPuntosEntrega, setErrorPuntosEntrega] = useState(null);

    const cargarPuntosEntrega = async () => {
        try {
            setCargandoPuntosEntrega(true);
            setErrorPuntosEntrega(null);
            const data = await obtenerPuntosEntregaActivos();
            setPuntosEntregaBD(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error al cargar puntos de entrega:', error);
            setErrorPuntosEntrega(error.message || 'Error al cargar puntos de entrega');
            setPuntosEntregaBD([]);
        } finally {
            setCargandoPuntosEntrega(false);
        }
    };

    useEffect(() => {
        cargarPuntosEntrega();
    }, []);

    return {
        puntosEntregaBD,
        cargandoPuntosEntrega,
        errorPuntosEntrega,
        recargarPuntosEntrega: cargarPuntosEntrega
    };
};

export default usePuntosEntrega;
