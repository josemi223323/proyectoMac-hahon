/* importa el json de paises para poder cargarlo en cargarMapa */
import { crearInterfaz } from "./interfazPais.js";
window.addEventListener("load", function () {
  fetch("jsons/paises.json")
    .then((response) => {
      if (!response.ok) throw new Error("Error en la respuesta de la red");
      return response.json();
    })
    .then((datos) => {
      cargarMapa(datos);
    })
    .catch((error) => console.error("Error en la petición:", error));
});
// ---------- Proyección cónica conforme de Lambert, calculos complicados no tocar ----------
function cargarMapa(DATOS) {
  const RAD = Math.PI / 180;
  const LON0 = 15 * RAD,
    LAT1 = 35 * RAD,
    LAT2 = 65 * RAD,
    LAT0 = 52 * RAD;
  const N =
    Math.log(Math.cos(LAT1) / Math.cos(LAT2)) /
    Math.log(
      Math.tan(Math.PI / 4 + LAT2 / 2) / Math.tan(Math.PI / 4 + LAT1 / 2),
    );
  const F =
    (Math.cos(LAT1) * Math.pow(Math.tan(Math.PI / 4 + LAT1 / 2), N)) / N;
  const rho = (lat) => F / Math.pow(Math.tan(Math.PI / 4 + lat / 2), N);
  const rho0 = rho(LAT0);
  function proyectar(lon, lat) {
    const t = N * (lon * RAD - LON0),
      r = rho(lat * RAD);
    return [r * Math.sin(t), -(rho0 - r * Math.cos(t))];
  }

  // ---------- Preparación: un Path2D por provincia + caja para acelerar el clic ----------
  function colorPais(nombre) {
    document
      .getElementById("modal-cerrar")
      .addEventListener("click", () => modal.close());
    // un tono estable por país
    let h = 0;
    for (const ch of nombre) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return { h: h % 360, s: 28 + ((h >> 8) % 18), l: 38 + ((h >> 16) % 14) };
  }
  const provincias = DATOS.map((d) => {
    const path = new Path2D();
    let x0 = 1e9,
      y0 = 1e9,
      x1 = -1e9,
      y1 = -1e9;
    for (const anillo of d.p) {
      anillo.forEach(([lon, lat], i) => {
        const [x, y] = proyectar(lon, lat);
        i ? path.lineTo(x, y) : path.moveTo(x, y);
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      });
      path.closePath();
    }
    const c = colorPais(d.c);
    return {
      nombre: d.n,
      pais: d.c,
      path,
      caja: [x0, y0, x1, y1],
      color: `hsl(${c.h} ${c.s}% ${c.l}%)`,
      colorHover: `hsl(${c.h} ${c.s}% ${c.l + 14}%)`,
    };
  });

  const e1 = proyectar(-12, 36),
    e2 = proyectar(40, 36),
    e3 = proyectar(-8, 66),
    e4 = proyectar(35, 66);
  const xs = [e1[0], e2[0], e3[0], e4[0]],
    ys = [e1[1], e2[1], e3[1], e4[1]];
  const caja = {
    x0: Math.min(...xs),
    x1: Math.max(...xs),
    y0: Math.min(...ys),
    y1: Math.max(...ys),
  };

  // ---------- Canvas y cámara ----------
  const canvas = document.getElementById("mapa");
  const ctx = canvas.getContext("2d");
  const info = document.getElementById("info");
  const cam = { x: 0, y: 0, k: 1, k0: 1 };
  let hover = null,
    seleccionada = null,
    pendiente = false;
  function ajustar() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    const w = canvas.clientWidth,
      h = canvas.clientHeight;
    cam.k = cam.k0 =
      Math.min(w / (caja.x1 - caja.x0), h / (caja.y1 - caja.y0)) * 0.95;
    cam.x = w / 2 - (cam.k * (caja.x0 + caja.x1)) / 2;
    cam.y = h / 2 - (cam.k * (caja.y0 + caja.y1)) / 2;
    dibujar();
  }

  function dibujar() {
    pendiente = false;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#16324a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr * cam.k, 0, 0, dpr * cam.k, dpr * cam.x, dpr * cam.y);
    ctx.lineJoin = "round";
    ctx.lineWidth = 0.8 / cam.k; // grosor constante en pantalla
    ctx.strokeStyle = "rgba(10,20,30,.75)";
    for (const p of provincias) {
      ctx.fillStyle =
        p === seleccionada ? "#d9a441" : p === hover ? p.colorHover : p.color;
      ctx.fill(p.path);
      ctx.stroke(p.path);
    }
    if (seleccionada || hover) {
      // resalta el contorno de la provincia activa
      ctx.lineWidth = 2 / cam.k;
      ctx.strokeStyle = "#fff";
      ctx.stroke((seleccionada || hover).path);
    }
  }
  const redibujar = () => {
    if (!pendiente) {
      pendiente = true;
      requestAnimationFrame(dibujar);
    }
  };

  // ---------- Interacción ----------
  function provinciaEn(px, py) {
    const mx = (px - cam.x) / cam.k,
      my = (py - cam.y) / cam.k;
    ctx.setTransform(1, 0, 0, 1, 0, 0); // isPointInPath(path, x, y) con coordenadas del mapa
    for (let i = provincias.length - 1; i >= 0; i--) {
      const p = provincias[i],
        b = p.caja;
      if (mx < b[0] || mx > b[2] || my < b[1] || my > b[3]) continue;
      if (ctx.isPointInPath(p.path, mx, my)) return p;
    }
    return null;
  }
  const texto = (p) =>
    p
      ? `<b>${p.nombre}</b><br><small>${p.pais}</small>`
      : "<b>Europa</b><br><small>Pasa el ratón por una provincia</small>";

  let arrastrando = false,
    movido = false,
    ult = null;
  canvas.addEventListener("pointerdown", (e) => {
    arrastrando = true;
    movido = false;
    ult = [e.clientX, e.clientY];
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add("dragging");
  });
  canvas.addEventListener("pointermove", (e) => {
    if (arrastrando) {
      const dx = e.clientX - ult[0],
        dy = e.clientY - ult[1];
      cam.x += dx;
      cam.y += dy;
      ult = [e.clientX, e.clientY];
      if (Math.abs(dx) + Math.abs(dy) > 2) movido = true;
    } else {
      const r = canvas.getBoundingClientRect();
      const p = provinciaEn(e.clientX - r.left, e.clientY - r.top);
      if (p !== hover) {
        hover = p;
        if (!seleccionada) info.innerHTML = texto(p);
      }
    }
    redibujar();
  });
  canvas.addEventListener("pointerup", (e) => {
    arrastrando = false;
    canvas.classList.remove("dragging");
    if (!movido) {
      const r = canvas.getBoundingClientRect();
      seleccionada = provinciaEn(e.clientX - r.left, e.clientY - r.top);
      info.innerHTML = texto(seleccionada || hover);
      redibujar();
    }
  });
  canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      const px = e.clientX - r.left,
        py = e.clientY - r.top;
      const nk = Math.min(
        Math.max(cam.k * Math.exp(-e.deltaY * 0.0015), cam.k0 * 0.6),
        cam.k0 * 60,
      );
      const f = nk / cam.k;
      cam.x = px - (px - cam.x) * f;
      cam.y = py - (py - cam.y) * f;
      cam.k = nk;
      redibujar();
    },
    { passive: false },
  );
  canvas.addEventListener("pointerup", (e) => {
    arrastrando = false;
    canvas.classList.remove("dragging");
    if (!movido) {
      const r = canvas.getBoundingClientRect();
      seleccionada = provinciaEn(e.clientX - r.left, e.clientY - r.top);
      info.innerHTML = texto(seleccionada || hover);
      redibujar();

      // NUEVO: abrir el modal solo si pulsaste sobre un país
      if (seleccionada) {
        crearInterfaz(seleccionada);
      }
    }
  });

  window.addEventListener("resize", ajustar);
  ajustar();
}
