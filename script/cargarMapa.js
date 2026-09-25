

fetch('media/europa1871.svg')
    .then(respuesta => respuesta.text())
    .then(svgTexto => {
        document.getElementById('contenedor-mapa').innerHTML = svgTexto;

        // Ahora ya puedes seleccionar los paths normalmente
        const paths = document.querySelectorAll('#contenedor-mapa path');
        paths.forEach(path => {
            path.addEventListener('click', () => {
                console.log('Clicaste:', path.id);
            });
        });
    });
