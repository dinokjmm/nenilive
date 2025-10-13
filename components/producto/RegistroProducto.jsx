 
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
]

function RegistroProducto() {
    const [reglasCategorias, setReglasCategorias] = useState([]); 
    const [formData, setFormData] = useState({
        // CAMPOS DE CLASIFICACIÓN
        dueñoSeleccionado: DUENOS_PROVEEDORES[0].codigo, 
        categoriaBase: '', // Se inicializará en useEffect
        subcategoriaSeleccionada: '', // Se inicializará en useEffect
        
        // CAMPOS DE DETALLES
        descripcion: '',
        cantidad: '1', 
        precio_local: '',
        precio_live: '',
        estatus: 'disponible', 
        tallas: '', 
        fotos: '' 
    });
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

    // Maneja los cambios de todos los campos, EXCEPTO categoriaBase
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

        // CRÍTICO: Validar que los campos de clasificación tengan valor
        if (!formData.dueñoSeleccionado || !formData.categoriaBase || !formData.subcategoriaSeleccionada) {
            setMensaje('❌ Por favor, selecciona Dueño, Categoría Base y Subcategoría antes de registrar.');
            return;
        }

        // 1. CONVERTIR y CREAR OBJETO DE DATOS
        const dataToSend = {
            // Se envían los 5 campos clave para la generación del código en el backend y para guardar
            dueñoSeleccionado: formData.dueñoSeleccionado,
            categoriaBase: formData.categoriaBase, // ⬅️ ENVIADO
            subcategoriaSeleccionada: formData.subcategoriaSeleccionada, // ⬅️ ENVIADO

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
                const defaultBase = reglasCategorias[0]?.categoriaBase || '';
                const defaultSub = reglasCategorias[0]?.subcategorias[0]?.nombre || '';

                setFormData({ 
                    dueñoSeleccionado: DUENOS_PROVEEDORES[0].codigo, 
                    categoriaBase: defaultBase, 
                    subcategoriaSeleccionada: defaultSub,
                    descripcion: '', cantidad: '1', precio_local: '', precio_live: '', 
                    estatus: 'disponible', tallas: '', fotos: '' 
                });
            } else {
                const errorData = await response.json();
                setMensaje(`❌ Error al registrar: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
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
                
                {/* 1. SECCIÓN DE CLASIFICACIÓN (GENERACIÓN AUTOMÁTICA) */}
                <h3 style={{ margin: '0', color: '#303952', fontSize: '1.1rem' }}>Clasificación para Código Único</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    
                    {/* Dueño/Marca */}
                    <div>
                        <label style={labelStyle}>Dueño/Marca:</label>
                        <select
                            name="dueñoSeleccionado"
                            value={formData.dueñoSeleccionado}
                            onChange={handleChange}
                            style={selectStyle}
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
                            onChange={handleBaseChange} // Usa el handler especial para resetear la subcategoría
                            style={selectStyle}
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
                            // Deshabilita si no hay categorías cargadas
                            disabled={!reglaActiva || reglaActiva.subcategorias.length === 0}
                        >
                            {reglaActiva && reglaActiva.subcategorias.map(sub => (
                                <option key={sub.nombre} value={sub.nombre}>
                                    {sub.nombre} ({sub.prefijo})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Preview del Código */}
                <p style={{ marginTop: '5px', padding: '10px', backgroundColor: '#f4f7f9', borderRadius: '5px', borderLeft: '3px solid #303952' }}>
                    <span style={{ fontWeight: 'bold', color: '#303952' }}>Preview del Código:</span> 
                    <span style={{ fontFamily: 'monospace', fontWeight: '600', color: '#007bff' }}>
                        {/* Ejemplo: J-DRI-0001 (Donde DRI es D + RI) */}
                        {formData.dueñoSeleccionado}-{categoriaPrefijo}{subcategoriaPrefijo}-0001
                    </span>
                </p>

                {/* 2. SECCIÓN DE DETALLES DEL PRODUCTO */}
                <h3 style={{ margin: '0', marginTop: '15px', color: '#303952', fontSize: '1.1rem' }}>Detalles y Precios</h3>

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
                            <option value="apartado-live">Apartado (Live)</option>
                            <option value="vendido-local">Vendido (Local)</option>
                            <option value="vendido-live">Vendido (Live)</option>
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
