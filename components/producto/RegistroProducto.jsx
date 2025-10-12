import React, { useState } from 'react';

// URL de tu API en Railway (¡Recuerda que debe ser la pública!)
const API_BASE_URL = 'https://neni-system-api-production.up.railway.app/api/productos'; 

function RegistroProducto() {
  const [formData, setFormData] = useState({
    codigo: '',
    descripcion: '',
    categoria: 'GENERAL',
  
   // ⬅️ AÑADIR ESTO:
    cantidad: '1', // Valor inicial
    precio_local: '',
    precio_live: '',
    estatus: 'disponible', // Valor por defecto
    tallas: '', // Se manejará como string separado por comas
    fotos: ''   // Se manejará como string separado por comas
  });

 
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('Registrando...');

    // 1. Convertir tallas y fotos a arrays para Mongoose
    const dataToSend = {
      ...formData,
      tallas: formData.tallas.split(',').map(t => t.trim().toUpperCase()).filter(t => t),
      fotos: formData.fotos.split(',').map(f => f.trim()).filter(f => f)
    };

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        setMensaje('✅ Prenda registrada con éxito!');
        // Limpiar formulario
        setFormData({ 
          codigo: '', descripcion: '', precio_local: '', precio_live: '', 
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

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Registro de Nueva Prenda (Neni Admin)</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
        
        {/* Campo Código */}
        <label>Código:</label>
        <input name="codigo" value={formData.codigo} onChange={handleChange} required />
        
        {/* Campo Descripción */}
        <label>Descripción:</label>
        <input name="descripcion" value={formData.descripcion} onChange={handleChange} required />

        {/* ⬅️ AÑADIR ESTE NUEVO CAMPO DE CANTIDAD/STOCK */}
        <label>Cantidad (Stock):</label>
        <input type="number" 
            name="cantidad" 
            value={formData.cantidad} 
            onChange={handleChange} 
            min="0"
            required />

        {/* Campo Precio Local */}
        <label>Precio Local:</label>
        <input type="number" name="precio_local" value={formData.precio_local} onChange={handleChange} required />
        
        {/* Campo Precio Live (Público) */}
        <label>Precio Live (Venta):</label>
        <input type="number" name="precio_live" value={formData.precio_live} onChange={handleChange} required />
        
        {/* Estatus */}
        <label>Estatus:</label>
        <select name="estatus" value={formData.estatus} onChange={handleChange}>
          <option value="disponible">Disponible</option>
          <option value="agotado">Agotado</option>
        </select>

        {/* Tallas (Separadas por Coma) */}
        <label>Tallas (Ej: CH, M, G):</label>
        <input name="tallas" value={formData.tallas} onChange={handleChange} placeholder="Ej: CH, M, G" />
        
        {/* Fotos (URLs Separadas por Coma) */}
        <label>URLs de Fotos (Separadas por Coma - usar Cloudinary):</label>
        <textarea name="fotos" value={formData.fotos} onChange={handleChange} rows="3" placeholder="Pega aquí las URLs de Cloudinary separadas por coma"></textarea>
        
        {/* Botón de Envío */}
        <button type="submit">Registrar Prenda</button>
      </form>
      {mensaje && <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{mensaje}</p>}
    </div>
  );
}

export default RegistroProducto;