import React from 'react';
import ProductCard from './ProductoCard'; // ⬅️ Importar el nuevo componente

const Catalogo = ({ productos, loading }) => {
  if (loading) {
    return <h2 style={{ textAlign: 'center' }}>Cargando Catálogo...</h2>;
  }

  if (!productos || productos.length === 0) {
    return <h2 style={{ textAlign: 'center' }}>¡Catálogo vacío! Registra tu primera prenda.</h2>;
  }

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Catálogo en Existencia ({productos.length})</h1>
      {/* Usamos la clase product-list definida en el CSS */}
      <div className="product-list">
        {productos.map(producto => (
            // ⬅️ Renderiza la nueva tarjeta para cada producto
            <ProductCard key={producto.codigo} producto={producto} />
        ))}
      </div>
    </div>
  );
};

export default Catalogo;