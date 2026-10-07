import { cargarMapa } from "./canva.js";
window.addEventListener("load", function () {
  Promise.all([
    fetch("jsons/paises.json").then((r) => {
      if (!r.ok) throw new Error("Error cargando paises.json");
      return r.json();
    }),
    fetch("jsons/colorPaises.json").then((r) => {
      if (!r.ok) throw new Error("Error cargando colores.json");
      return r.json();
    }),
  ])
    .then(([Paises, colores]) => {
      cargarMapa(Paises, colores);
    })
    .catch((error) => console.error("Error en la petición:", error));
});