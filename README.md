# demo mac-hahon

Proyecto personal hecho por diversión: un juego de estrategia en desarrollo. Ahora mismo es solo una demo del mapa de Europa en Canvas 2D.

Objetivo:Ambientado en la guerra franco-prusiana (1870-71), permite jugar como Francia o Prusia sobre un mapa interactivo en SVG. Este prototipo sirve para validar la viabilidad del concepto antes de abordar el TFG completo.

## Estado del proyecto

En desarrollo — prototipo / demo de viabilidad.

## Características actuales

- Mapa interactivo en canvas
- Panel de información al seleccionar un país/territorio
- Frontend-only, sin backend ni multijugador (por ahora)

## Tecnologías

- HTML, CSS, JavaScript (vanilla)
- un json con los datos de los paises

## Cómo ejecutarlo

1. Clona el repositorio
2. Sirve la carpeta con un servidor local (por ejemplo, la extensión **Live Server** de VS Code)
3. Abre la URL local en el navegador

> No abras el `index.html` directamente con doble clic — al usar `fetch()` para cargar el json, el navegador bloquea la petición si no se sirve desde un servidor local.

## Créditos

- geojson.io me sirvió para crear las provincias
## Autor

Josemi

## Licencia

