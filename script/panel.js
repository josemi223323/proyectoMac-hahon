document.addEventListener('DOMContentLoaded', () => {
  fetch('media/europa1871.svg')
    .then(respuesta => respuesta.text())
    .then(svgTexto => {
      document.querySelector('.contenedor-mapa').innerHTML = svgTexto;
      inicializarClicsMapa();
    })
    .catch(error => console.error('Fallo al cargar el SVG:', error));
});

// Datos de cada país. La clave debe coincidir EXACTAMENTE con el id del <path> en el SVG
const datosPaises = {
  'First French Empire': {
    nombre: 'Francia',
    bandera: 'banderas/francia.webp',
    descripcion: 'Segundo Imperio Francés, gobernado por Napoleón III.'
  },
  'Weimar Republic': {
    nombre: 'Prusia / Imperio Alemán',
    bandera: 'banderas/prusia.png',
    descripcion: 'Reino de Prusia, liderando la unificación alemana.'
  }
  // añade aquí el resto de ids según los tengas en tu SVG
};

function inicializarClicsMapa() {
  const paths = document.querySelectorAll('.contenedor-mapa path');

  paths.forEach(path => {
    path.addEventListener('click', () => {
      mostrarInfoPais(path.id);
    });
  });

  document.getElementById('cerrar-panel').addEventListener('click', () => {
    document.getElementById('panel-info').style.display = 'none';
  });
}

function mostrarInfoPais(id) {
  const pais = datosPaises[id];

  if (!pais) {
    console.warn('No hay datos para el país con id:', id);
    return;
  }

  document.getElementById('panel-nombre').textContent = pais.nombre;
  document.getElementById('panel-bandera').src = pais.bandera;
  document.getElementById('panel-descripcion').textContent = pais.descripcion;
  document.getElementById('panel-info').style.display = 'block';
}