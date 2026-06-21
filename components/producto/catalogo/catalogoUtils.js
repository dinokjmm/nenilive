// src/components/producto/catalogo/catalogoUtils.js

export const normalizar = (valor) => {
    return String(valor || '').toLowerCase().trim();
};

export const normalizarMayus = (valor) => {
    return String(valor || '').toUpperCase().trim();
};

export const obtenerPrecio = (producto) => {
    return Number(
        producto.precio_local ??
        producto.precioVenta ??
        producto.precio ??
        0
    );
};

export const obtenerMarca = (producto) => {
    const marcaDirecta = producto.marca || producto.brand || '';
    const descripcion = normalizar(producto.descripcion);

    if (marcaDirecta) {
        return marcaDirecta;
    }

    if (descripcion.includes('natura')) return 'NATURA';
    if (descripcion.includes('jafra')) return 'JAFRA';

    if (
        descripcion.includes('lbel') ||
        descripcion.includes("l'bel") ||
        descripcion.includes('l bel')
    ) {
        return "L'BEL";
    }

    return 'SIN MARCA';
};

export const obtenerIdProducto = (producto) => {
    return producto._id || producto.codigo;
};

export const productoNoDisponible = (producto) => {
    const estatus = normalizar(producto.estatus);

    return (
        estatus.includes('apartado') ||
        estatus.includes('reservado') ||
        estatus.includes('vendido')
    );
};

export const productoEstaSeleccionado = (producto, productosSeleccionados) => {
    const id = obtenerIdProducto(producto);
    return productosSeleccionados.some(p => obtenerIdProducto(p) === id);
};

export const filtrarProductosCatalogo = ({
    productos,
    busqueda,
    filtroMarca
}) => {
    const textoBusqueda = normalizar(busqueda);

    return productos.filter((producto) => {
        const codigo = normalizar(producto.codigo);
        const descripcion = normalizar(producto.descripcion);
        const categoria = normalizar(producto.categoriaBase);
        const subcategoria = normalizar(producto.subcategoriaSeleccionada);
        const marca = normalizar(obtenerMarca(producto));

        const pasaBusqueda = !textoBusqueda ||
            codigo.includes(textoBusqueda) ||
            descripcion.includes(textoBusqueda) ||
            categoria.includes(textoBusqueda) ||
            subcategoria.includes(textoBusqueda) ||
            marca.includes(textoBusqueda);

        const marcaProducto = normalizarMayus(obtenerMarca(producto)).replace("'", '');
        const marcaFiltro = normalizarMayus(filtroMarca).replace("'", '');

        const pasaMarca = filtroMarca === 'Ver Todo' || marcaProducto === marcaFiltro;

        return pasaBusqueda && pasaMarca;
    });
};

export const construirCalendarioEntregas = (puntosEntregaBD = []) => {
    return puntosEntregaBD.map((item) => {
        const esDomicilio = item.tipo === 'DOMICILIO';

        return {
            id: item._id,
            icono: esDomicilio ? '🚚' : '📍',
            dia: item.dias && item.dias.length > 0
                ? item.dias.join(', ')
                : 'Día por confirmar',
            lugar: item.nombre,
            hora: item.horarioTexto || `${item.horaInicio || ''} - ${item.horaFin || ''}`,
            tipo: item.tipo,
            costo: item.costo,
            costoDesde: item.costoDesde,
            direccion: item.direccion,
            referencia: item.referencia,
            zona: item.zona
        };
    });
};
export const obtenerProductosIntercambioDefault = () => ([
    {
        id: 'ropa-nino',
        icono: '🧒',
        texto: 'Ropa niño 3 a 4 años',
        descripcion: 'Prendas específicas para niño',
        productos: [
            {
                id: 'short-lino-algodon-3-4',
                texto: 'Short de lino o algodón',
                detalle: 'Talla 3 a 4 años'
            }
        ]
    },
    {
        id: 'ropa-nina',
        icono: '👧',
        texto: 'Ropa niña talla 10 a 12',
        descripcion: 'Prendas específicas para niña',
        productos: [
            {
                id: 'blusas-nina-10-12',
                texto: 'Blusas',
                detalle: 'Talla 10 a 12'
            }
        ]
    },
    {
        id: 'hogar',
        icono: '🏠',
        texto: 'Hogar seleccionado',
        descripcion: 'Artículos de hogar aceptados para revisión',
        productos: [
            {
                id: 'velas-aromaticas',
                texto: 'Velas aromáticas',
                detalle: 'En buen estado'
            },
            {
                id: 'recuadros-para-colgar',
                texto: 'Recuadros para colgar',
                detalle: 'En buen estado'
            }
        ]
    },
    {
        id: 'natura',
        icono: '🌿',
        texto: 'Productos Natura seleccionados',
        descripcion: 'Solo productos Natura específicos',
        productos: [
            {
                id: 'jabones-barra-natura',
                texto: 'Jabones en barra',
                detalle: 'No líquidos'
            },
            {
                id: 'perfumes-kaiak',
                texto: 'Perfumes Kaiak',
                detalle: 'Cerrados o en buen estado'
            },
            {
                id: 'shampoo-ekos-pataua',
                texto: 'Shampoo Ekos Patauá',
                detalle: 'Cerrado o en buen estado'
            },
            {
                id: 'desodorante-erva-doce-aclarante',
                texto: 'Desodorante Erva Doce Aclarante',
                detalle: 'Cerrado o en buen estado'
            }
        ],
        nota: 'No se aceptan jabones líquidos.'
    }
]);


export const obtenerOpcionesEntregaDefault = () => ([
    {
        id: 'PUNTO_SEMANAL',
        nombre: 'Punto de entrega',
        descripcion: 'Seleccionaré uno de los puntos disponibles.'
    },
    {
        id: 'PUNTO_MEDIO_DOMINGO',
        nombre: 'Punto medio domingo',
        descripcion: 'Me interesa acordar un punto medio para el domingo.'
    },
    {
        id: 'DOMICILIO',
        nombre: 'Entrega a domicilio',
        descripcion: 'Solo Querétaro, Qro. Domingo de 4:00 pm a 7:00 pm. Desde $50 según zona.'
    },
    {
        id: 'OTRA',
        nombre: 'Otra opción',
        descripcion: 'Quiero consultar otra forma de entrega por WhatsApp.'
    }
]);
