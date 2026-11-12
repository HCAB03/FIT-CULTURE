# HEADS FIT V6 — compra móvil en hoja inferior

## Qué cambió

- Se corrigió el error JavaScript del botón **«+ / Personalizar»**: se usaba un selector que devuelve un solo elemento y luego se intentaba ejecutar métodos de colecciones (`filter` / `forEach`). Los selectores se ajustaron correctamente.
- En dispositivos táctiles, tocar la fotografía abre una **hoja de selección desde la parte inferior** con fotografía del producto, marca, nombre, color/sabor, tallas/presentaciones, cantidad y botón grande **Añadir a mi bolsa**.
- Tocar un color/sabor cambia la fotografía cuando existe la imagen asociada.
- La talla/presentación seleccionada queda resaltada; el botón de añadir se habilita al seleccionar una opción.
- Se mantienen los paneles de selección por desplazamiento del cursor en escritorio y la ficha breve **Ver detalles**.
- El panel es compatible con zonas seguras de iOS, movimiento reducido, cierre por botón o fondo, y tamaños de pantalla pequeños.
- Los pedidos continúan por WhatsApp **+593 98 355 1261**, sin cobrar ni declarar existencias automáticamente.

## Verificación técnica

- JavaScript analizado sin errores sintácticos.
- Prueba del flujo táctil simulada: abrir «+», escoger talla M, subir la cantidad a 2 y confirmar. La bolsa obtuvo una camiseta con color negro, talla M y cantidad 2.
- Se verificaron reglas de la hoja móvil, botón inhabilitado antes de seleccionar talla y opción de cerrar.

**Limitación:** aún es necesario probar visualmente en teléfonos reales (Android/iOS) y comprobar las imágenes remotas. El catálogo es orientativo, con precios y stock por confirmar, y puede requerir autorización de uso comercial de fotografías.
