import React, { useState, useEffect } from 'react';

// URL de tu API en Railway
const API_BASE_URL = 'https://neni-system-api-production.up.railway.app/api/productos'; 
const API_REGLAS_URL = 'https://neni-system-api-production.up.railway.app/api/reglas'; 

const DUENOS_PROVEEDORES = [
    { codigo: 'Z', nombre: 'Karla y Cecy' },
    { codigo: 'J', nombre: 'JACKO' },
    { codigo: 'C', nombre: 'Cecy' },
    { codigo: 'Y', nombre: 'Vale y Cecy' },
    { codigo: 'K', nombre: 'Karla' },
    { codigo: 'A1', nombre: 'Arrendador 1' },
    { codigo: 'A2', nombre: 'Arrendador 2' },
    { codigo: 'D', nombre: 'Dani' },
    { codigo: 'V', nombre: 'Vale' },
    { codigo: 'L', nombre: 'Daniel' },
];

function RegistroProducto() {
    const [reglasCategorias, setReglasCategorias] = useState([]); 
    const [formData, setFormData] = useState({
        // CAMPOS DE CLASIFICACIÓN
        dueñoSeleccionado: DUENOS_PROVEEDORES[0].codigo, 
        categoriaBase: '',
        subcategoriaSeleccionada: '',
        
        // CAMPOS DE DETALLES
        descripcion: '',
        cantidad: '1', 
        precio_local: '',
        precio_live: '',
        estatus: 'disponible', 
        tallas: '', 
        fotos: '',
        
        // NUEVOS CAMPOS PARA CÓDIGO MANUAL
        codigo: '', 
    });
    
    // ESTADO para controlar si se usa el código manual o la generación automática
    const [usoCodigoManual, setUsoCodigoManual] = useState(false); 

    const [mensaje, setMensaje] = useState('');
    const [loadingReglas, setLoadingReglas] = useState(true);

    // 1. EFECTO PARA OBTENER LAS REGLAS Y ESTABLECER VALORES INICIALES
    useEffect(() => {
        const fetchReglas = async () => {
            try {
                const response = await fetch(API_REGLAS_URL);
                
                if (!response.ok) {
                    const errorDetails = await response.text();
                    console.error('Error de respuesta de la API de reglas:', response.status, response.statusText, errorDetails);
                    throw new Error(`Fallo en la API de reglas. Código: ${response.status}`);
                }
                
                const data = await response.json();
                setReglasCategorias(data);
                
                // CRÍTICO: Establecer valores por defecto del primer elemento
                if (data.length > 0) {
                    const defaultBase = data[0].categoriaBase;
                    const defaultSub = data[0].subcategorias[0]?.nombre || '';

                    setFormData(prevData => ({
                        ...prevData,
                        categoriaBase: defaultBase,
                        subcategoriaSeleccionada: defaultSub,
                    }));
                }
            } catch (error) {
                console.error('Fallo al obtener reglas (red/conexión/json):', error);
                setMensaje(`❌ Error al cargar las reglas de negocio. Revisa la consola del navegador para ver detalles.`);
            } finally {
                setLoadingReglas(false);
            }
        };
        fetchReglas();
    }, []);

    // Maneja los cambios de todos los campos
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Función CRÍTICA para manejar el cambio de CATEGORÍA BASE
    const handleBaseChange = (e) => {
        const newBase = e.target.value;
        const newRule = reglasCategorias.find(r => r.categoriaBase === newBase);
        
        // Resetea la subcategoría al primer valor de la nueva Categoría Base
        const defaultSub = newRule?.subcategorias[0]?.nombre || '';

        setFormData(prevData => ({ 
            ...prevData, 
            categoriaBase: newBase,
            subcategoriaSeleccionada: defaultSub 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje('Registrando...');

        // 1. VALIDACIÓN
        // Si el código manual está activado, se valida que el campo 'codigo' no esté vacío.
        if (usoCodigoManual && !formData.codigo.trim()) {
            setMensaje('❌ Si activaste el Código Manual, debes ingresar un valor.');
            return;
        }
        
        // La clasificación SIEMPRE debe estar seleccionada ya que es requerida para la metadata.
        if (!formData.dueñoSeleccionado || !formData.categoriaBase || !formData.subcategoriaSeleccionada) {
            setMensaje('❌ Por favor, selecciona Dueño, Categoría Base y Subcategoría antes de registrar.');
            return;
        }


        // 2. CONVERTIR y CREAR OBJETO DE DATOS
        const dataToSend = {
            // Si se usa el código manual, se incluye para que el backend lo use como el código final.
            // Si NO se usa (usoCodigoManual=false), este campo no se envía y el backend generará el código.
            ...(usoCodigoManual && { codigo: formData.codigo.trim().toUpperCase() }), 
            
            // Los campos de clasificación se envían siempre.
            dueñoSeleccionado: formData.dueñoSeleccionado,
            categoriaBase: formData.categoriaBase, 
            subcategoriaSeleccionada: formData.subcategoriaSeleccionada, 

            descripcion: formData.descripcion,
            // Convertir valores numéricos y arrays
            cantidad: parseInt(formData.cantidad, 10), 
            precio_local: parseFloat(formData.precio_local || 0),
            precio_live: parseFloat(formData.precio_live || 0),
            estatus: formData.estatus,
            tallas: formData.tallas.split(',').map(t => t.trim().toUpperCase()).filter(t => t),
            fotos: formData.fotos.split(',').map(f => f.trim()).filter(f => f)
        };
        
        console.log('Datos enviados:', dataToSend);

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });

            if (response.ok) {
                const productoRegistrado = await response.json();
                setMensaje(`✅ Producto registrado con éxito! Código: ${productoRegistrado.codigo}`);
                
                // Limpiar formulario manteniendo las selecciones de clasificación
                const currentBase = formData.categoriaBase;
                const currentSub = formData.subcategoriaSeleccionada;

                setFormData({ 
                    dueñoSeleccionado: formData.dueñoSeleccionado, 
                    categoriaBase: currentBase, 
                    subcategoriaSeleccionada: currentSub,
                    descripcion: '', cantidad: '1', precio_local: '', precio_live: '', 
                    estatus: 'disponible', tallas: '', fotos: '',
                    codigo: '' // Limpiar código manual
                });
                setUsoCodigoManual(false); // Resetear el toggle
            } else {
                const errorData = await response.json();
                // Manejar error 409 (Conflicto) para código duplicado
                if (response.status === 409) {
                     setMensaje(`❌ Error al registrar: ${errorData.message || 'El código ingresado ya existe. Intenta con otro o verifica el inventario.'}`);
                } else {
                    setMensaje(`❌ Error al registrar: ${errorData.message || response.statusText}`);
                }
            }
        } catch (error) {
            console.error(error);
            setMensaje('❌ Error de conexión con la API.');
        }
    };
    
    // Obtener la regla activa para determinar las subcategorías en el selector
    const reglaActiva = reglasCategorias.find(r => r.categoriaBase === formData.categoriaBase);
    
    // Obtener prefijos para la previsualización del código
    const subcategoriaRegla = reglaActiva?.subcategorias.find(
        (sub) => sub.nombre === formData.subcategoriaSeleccionada
    );
    const subcategoriaPrefijo = subcategoriaRegla?.prefijo || 'SC';
    const categoriaPrefijo = formData.categoriaBase ? formData.categoriaBase[0] : 'C'; // Primera letra de la categoría base

    // Previsualización del código automático
    const codigoPreview = `${formData.dueñoSeleccionado}-${categoriaPrefijo}${subcategoriaPrefijo}-0001`;

    // ----------------------------------------------------
    // Lógica de Renderizado
    // ----------------------------------------------------

    if (loadingReglas) {
        return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem', color: '#303952' }}>Cargando reglas de categorización...</div>;
    }

    if (reglasCategorias.length === 0 && !loadingReglas) {
        return <div style={{ textAlign: 'center', padding: '50px', color: 'red', fontWeight: 'bold' }}>🚨 Error: No se encontraron reglas de categorización en la BD.</div>;
    }

    // Estilos
    const inputStyle = { padding: '10px', border: '1px solid #ccc', borderRadius: '5px', width: '100%', boxSizing: 'border-box' };
    const labelStyle = { fontWeight: '600', marginBottom: '5px', display: 'block', color: '#303952' };
    const containerStyle = { padding: '20px', maxWidth: '600px', margin: 'auto', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' };
    const selectStyle = { ...inputStyle, appearance: 'none' };
    // Usamos disabledStyle solo para el campo de subcategoría si no hay reglas.
    const disabledStyle = { ...inputStyle, backgroundColor: '#f5f5f5', color: '#999', cursor: 'not-allowed' }; 


    return (
        <div style={containerStyle}>
            <h2 style={{ borderBottom: '2px solid #303952', paddingBottom: '10px', marginBottom: '20px', color: '#303952' }}>Registro de Nuevo Producto (Admin)</h2>
            
            {/* Mensaje de estado */}
            {mensaje && (
                <div style={{ padding: '10px', marginBottom: '20px', borderRadius: '5px', backgroundColor: mensaje.startsWith('❌') ? '#fdd' : '#dfd', color: mensaje.startsWith('❌') ? '#c00' : '#060' }}>
                    {mensaje}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
                
                {/* 0. SECCIÓN DE OPCIÓN DE CÓDIGO MANUAL */}
                <h3 style={{ margin: '0', color: '#303952', fontSize: '1.1rem', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Código de Producto</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px', border: '1px solid #ddd' }}>
                    <label style={{ fontWeight: '600', color: '#303952' }}>Usar Código Manual</label>
                    <input
                        type="checkbox"
                        checked={usoCodigoManual}
                        onChange={(e) => setUsoCodigoManual(e.target.checked)}
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                </div>

                {/* CÓDIGO MANUAL ACTIVO (Condicionalmente visible) */}
                {usoCodigoManual && (
                    <div style={{ paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                        <label style={labelStyle}>Código Único Manual:</label>
                        <input
                            type="text"
                            name="codigo"
                            value={formData.codigo}
                            onChange={handleChange}
                            style={{ ...inputStyle, borderColor: '#007bff', fontWeight: 'bold' }}
                            placeholder="Ej: J-VEST-0042 o 12345"
                            required
                        />
                        <p style={{ fontSize: '0.8rem', color: '#007bff', marginTop: '5px' }}>
                            ⚠ El código manual tiene prioridad y se usará como identificador único.
                        </p>
                    </div>
                )}
                
                {/* CLASIFICACIÓN (SIEMPRE VISIBLE) */}
                <h3 style={{ margin: '0', color: '#303952', fontSize: '1.1rem' }}>Clasificación de Producto (Requerido)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
                    
                    {/* Dueño/Marca */}
                    <div>
                        <label style={labelStyle}>Dueño/Marca:</label>
                        <select
                            name="dueñoSeleccionado"
                            value={formData.dueñoSeleccionado}
                            onChange={handleChange}
                            style={selectStyle}
                            required
                        >
                            {DUENOS_PROVEEDORES.map(dueno => (
                                <option key={dueno.codigo} value={dueno.codigo}>
                                    {dueno.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Categoría Base (Género/Público) */}
                    <div>
                        <label style={labelStyle}>Categoría Base (Género):</label>
                        <select
                            name="categoriaBase"
                            value={formData.categoriaBase}
                            onChange={handleBaseChange} 
                            style={selectStyle}
                            required
                        >
                            {reglasCategorias.map(regla => (
                                <option key={regla.categoriaBase} value={regla.categoriaBase}>
                                    {regla.categoriaBase}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Subcategoría (Tipo de Producto) */}
                    <div>
                        <label style={labelStyle}>Subcategoría (Tipo):</label>
                        <select
                            name="subcategoriaSeleccionada"
                            value={formData.subcategoriaSeleccionada}
                            onChange={handleChange}
                            style={selectStyle}
                            // Deshabilitado solo si no hay reglas activas.
                            disabled={!reglaActiva || reglaActiva.subcategorias.length === 0} 
                            required
                        >
                            {!reglaActiva || reglaActiva.subcategorias.length === 0 ? (
                                <option value="" disabled>Cargando...</option>
                            ) : (
                                reglaActiva.subcategorias.map(sub => (
                                    <option key={sub.nombre} value={sub.nombre}>
                                        {sub.nombre} ({sub.prefijo})
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                </div>
                
                {/* Preview del Código Automático (Siempre visible) */}
                <p style={{ 
                    marginTop: '5px', padding: '10px', borderRadius: '5px', 
                    backgroundColor: usoCodigoManual ? '#f0f0f0' : '#f4f7f9', 
                    borderLeft: `3px solid ${usoCodigoManual ? '#999' : '#303952'}` 
                }}>
                    <span style={{ fontWeight: 'bold', color: usoCodigoManual ? '#999' : '#303952' }}>Preview del Código Automático:</span> 
                    <span style={{ fontFamily: 'monospace', fontWeight: '600', color: usoCodigoManual ? '#999' : '#007bff' }}>
                        {codigoPreview}
                    </span>
                    {usoCodigoManual && (
                        <span style={{ fontSize: '0.8rem', color: '#999', display: 'block' }}>
                            (Clasificación para metadatos. El código final será el manual ingresado arriba.)
                        </span>
                    )}
                </p>


                {/* 2. SECCIÓN DE DETALLES DEL PRODUCTO */}
                <h3 style={{ margin: '0', marginTop: '15px', color: '#303952', fontSize: '1.1rem', borderTop: '1px solid #eee', paddingTop: '10px' }}>Detalles y Precios</h3>

                {/* Descripción */}
                <div>
                    <label style={labelStyle}>Descripción:</label>
                    <input
                        type="text"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />
                </div>

                {/* Cantidad y Estatus */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                        <label style={labelStyle}>Cantidad (Stock):</label>
                        <input
                            type="number"
                            name="cantidad"
                            value={formData.cantidad}
                            onChange={handleChange}
                            style={inputStyle}
                            min="1"
                            required
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Estatus Inicial:</label>
                        <select
                            name="estatus"
                            value={formData.estatus}
                            onChange={handleChange}
                            style={selectStyle}
                        >
                            <option value="disponible">Disponible</option>
                            <option value="disponible-publico">Diponible al publico (Live)</option>

                        </select>
                    </div>
                </div>

                {/* Precios */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                        <label style={labelStyle}>Precio Local ($):</label>
                        <input
                            type="number"
                            name="precio_local"
                            value={formData.precio_local}
                            onChange={handleChange}
                            style={inputStyle}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Precio Live ($):</label>
                        <input
                            type="number"
                            name="precio_live"
                            value={formData.precio_live}
                            onChange={handleChange}
                            style={inputStyle}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                </div>

                {/* Tallas y Fotos */}
                <div>
                    <label style={labelStyle}>Tallas (separadas por coma, Ej: S, M, L):</label>
                    <input
                        type="text"
                        name="tallas"
                        value={formData.tallas}
                        onChange={handleChange}
                        style={inputStyle}
                        placeholder="Ej: S, M, L, UNITALLA"
                    />
                </div>
                <div>
                    <label style={labelStyle}>URLs de Fotos (separadas por coma):</label>
                    <textarea
                        name="fotos"
                        value={formData.fotos}
                        onChange={handleChange}
                        style={{ ...inputStyle, minHeight: '80px' }}
                        placeholder="https://imagen1.jpg, https://imagen2.png"
                    />
                </div>
                
                {/* Botón de Registro */}
                <button 
                    type="submit" 
                    style={{ 
                        padding: '15px', 
                        backgroundColor: '#303952', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        fontSize: '1.1rem', 
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#4e5a7a'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#303952'}
                >
                    Registrar Producto
                </button>
            </form>
        </div>
    );
}

export default RegistroProducto;