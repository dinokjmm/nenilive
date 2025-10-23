// src/components/producto/Catalogo.jsx

import React, { useState } from "react";
import ProductCard from "../producto/ProductoCard";

const Catalogo = ({
  productos,
  loading,
  onFiltroGeneroChange,
  filtroGeneroActivo,
  categoriasGenero,
  onFiltroTipoChange,
  filtroTipoActivo,
  subcategoriasTipo,
}) => {
  // --- Paginación ---
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 12;

  const totalPaginas = Math.ceil(productos.length / productosPorPagina);
  const indiceInicial = (paginaActual - 1) * productosPorPagina;
  const indiceFinal = indiceInicial + productosPorPagina;
  const productosPaginados = productos.slice(indiceInicial, indiceFinal);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // --- Filtros ---
  const handleGeneroClick = (filtro) => {
    onFiltroTipoChange("Ver Todo");
    onFiltroGeneroChange(filtro);
    setPaginaActual(1);
  };

  const handleTipoClick = (filtro) => {
    onFiltroTipoChange(filtro);
    setPaginaActual(1);
  };

  if (loading) {
    return <h1 style={{ textAlign: "center", color: "#666" }}>Cargando Catálogo...</h1>;
  }

  const totalProductos = productos.length;
  const filtroActivoGeneral =
    filtroGeneroActivo !== "Ver Todo"
      ? filtroGeneroActivo
      : filtroTipoActivo !== "Ver Todo"
      ? filtroTipoActivo
      : "TODOS";

  return (
    <div style={{ padding: "10px 20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#222", fontSize: "22px", marginBottom: "10px" }}>
        Catálogo en Existencia ({totalProductos})
      </h1>

      {/* FILTROS DE GÉNERO */}
      <div style={{ marginBottom: "15px" }}>
        <h3 style={{ color: "#333", marginBottom: "6px" }}>Filtrar por Género:</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          <button
            className={`filtro-boton ${filtroGeneroActivo === "Ver Todo" ? "activo" : ""}`}
            onClick={() => handleGeneroClick("Ver Todo")}
          >
            Ver Todo
          </button>

          {categoriasGenero.map((cat) => (
            <button
              key={cat}
              className={`filtro-boton ${filtroGeneroActivo === cat ? "activo" : ""}`}
              onClick={() => handleGeneroClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FILTROS DE TIPO */}
      <div style={{ marginBottom: "15px" }}>
        <h3 style={{ color: "#333", marginBottom: "6px" }}>Filtrar por Tipo:</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          <button
            className={`filtro-boton ${filtroTipoActivo === "Ver Todo" ? "activo" : ""}`}
            onClick={() => handleTipoClick("Ver Todo")}
          >
            Ver Todo
          </button>

          {subcategoriasTipo.map((cat) => (
            <button
              key={cat}
              className={`filtro-boton ${filtroTipoActivo === cat ? "activo" : ""}`}
              onClick={() => handleTipoClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* MENSAJE SI NO HAY PRODUCTOS */}
      {totalProductos === 0 && filtroActivoGeneral !== "TODOS" && filtroActivoGeneral !== "Ver Todo" && (
        <p style={{ textAlign: "center", color: "#cc0000", marginTop: "40px", fontSize: "16px" }}>
          No hay productos registrados con los filtros activos.
        </p>
      )}

      {/* LISTA DE PRODUCTOS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "10px",
        }}
      >
        {productosPaginados.map((producto, index) => (
          <ProductCard key={index} producto={producto} />
        ))}
      </div>

      {/* PAGINACIÓN */}
      {totalPaginas > 1 && (
        <div style={{ textAlign: "center", marginTop: "25px" }}>
          <button
            className="boton-pagina"
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
          >
            ⬅
          </button>

          {[...Array(totalPaginas)].map((_, i) => (
            <button
              key={i + 1}
              className={`boton-pagina ${paginaActual === i + 1 ? "activo" : ""}`}
              onClick={() => cambiarPagina(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="boton-pagina"
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
          >
            ➡
          </button>
        </div>
      )}
    </div>
  );
};

export default Catalogo;
