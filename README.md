# [Nombre del proyecto]

Demo privada, solo-frontend y para un jugador, del videojuego de gran estrategia que estoy desarrollando como Trabajo de Fin de Grado (DAW).

Ambientado en la guerra franco-prusiana (1870-71), permite jugar como Francia o Prusia sobre un mapa interactivo en SVG. Este prototipo sirve para validar la viabilidad del concepto antes de abordar el TFG completo.

## Estado del proyecto

🚧 En desarrollo — prototipo / demo de viabilidad.

## Características actuales

- Mapa interactivo en SVG con territorios clicables
- Panel de información al seleccionar un país/territorio
- Frontend-only, sin backend ni multijugador (por ahora)

## Tecnologías

- HTML, CSS, JavaScript (vanilla)
- SVG para el mapa interactivo

## Cómo ejecutarlo

1. Clona el repositorio
2. Sirve la carpeta con un servidor local (por ejemplo, la extensión **Live Server** de VS Code, o `python -m http.server`)
3. Abre la URL local en el navegador

> No abras el `index.html` directamente con doble clic — al usar `fetch()` para cargar el SVG, el navegador bloquea la petición si no se sirve desde un servidor local.

## Créditos

- Mapa base: [Blank map of Europe 1871](https://commons.wikimedia.org/wiki/File:Blank_map_of_Europe_1871.svg) (Wikimedia Commons)

## Autor

Josemi

## Licencia

Uso académico / TFG. Pendiente de definir licencia final.
