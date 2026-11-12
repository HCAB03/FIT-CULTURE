# HEADS FIT V5 · selección rápida y catálogo curado

## Qué se implementó
- Tarjetas con **fotografía grande como protagonista**; la barra inferior «Ver opciones» abre el panel en móvil, y en escritorio se despliega con el cursor sobre la imagen.
- Panel superpuesto: variantes de color/sabor con muestras visuales, cantidad y botones de talla/presentación. **Pulsar una talla/presentación añade al carrito** la selección y la cantidad elegida. Para variantes con imagen distinta (p. ej., camiseta Gymshark Arrival verde/azul), la foto cambia con la muestra.
- Un único botón **VER DETALLES** debajo de la foto abre una ficha breve con descripción, ajuste o material cuando hay fuente, uso recomendado, vínculo a la referencia y advertencia de disponibilidad.
- Menú móvil grande, botón circular de WhatsApp y bolsa persistente de las versiones anteriores conservados.
- Filtros combinados de marca/categoría y búsqueda; la página Marcas utiliza imágenes de artículos de la propia marca.
- **18 fichas curadas** (10 prendas, 4 suplementos, 4 accesorios) en `assets/js/productos.js`. Se eliminaron de la salida visible las 72 fichas genéricas de demostración.
- No se muestra una foto de gimnasio o de otra prenda como reemplazo de imagen fallida: se presenta una tarjeta neutral de **«Imagen no disponible»**.

## Atención importante: no equivale a inventario real
Los nombres corresponden a modelos identificables y las fuentes están indicadas en cada ficha, pero estas fotos son URL externas. Se deben comprobar individualmente en un navegador, obtener permiso para su uso comercial y preferentemente sustituirlas por fotografías propias del inventario disponible antes del lanzamiento de ventas. Que una imagen aparezca en una web de una marca **no autoriza automáticamente** su reutilización. Los enlaces externos podrían dejar de funcionar o cambiar.

Las opciones de color, tamaño, sabor y presentación son **preferencias para consultar**, no garantía de existencia ni combinaciones de inventario. Sin backend no hay stock, administración, pago ni registro central de pedidos. El botón prepara un mensaje para WhatsApp +593 98 355 1261; el cliente confirma el envío en su aplicación.

## Pruebas pendientes antes de producción
1. En móvil real, tocar una foto, elegir color y cantidad y pulsar talla: comprobar que la bolsa recoge todos los datos.
2. En ordenador, pasar el cursor sobre la foto y probar navegación por teclado.
3. Probar búsqueda y filtros por marca en las tres secciones y en `catalogo.html`.
4. Probar variantes de Gymshark Arrival (la fotografía debe cambiar al elegir azul/verde).
5. Confirmar carga, exactitud visual y permisos de reutilización de **cada una de las 18 fotografías**. Si no carga, la interfaz muestra «Imagen no disponible».
6. Verificar con inventario propio qué tallas, colores, sabores y presentaciones están realmente disponibles.
7. Desde bolsa, comprobar el número de destino y la plantilla de WhatsApp para 1 y múltiples productos.

## Editar
- `assets/js/productos.js`: referencias, imágenes, opciones, características y fuentes.
- `assets/js/shop.js`: catálogo, componentes interactivos y pedido.
- `assets/css/v3.css`: estilos y adaptación responsive.
- `marcas.html`, `catalogo.html`, `ropa.html`, `suplementos.html`, `accesorios.html`: estructura HTML.

## Estado de pruebas
Validado estáticamente: sintaxis JavaScript, identificadores únicos, estructuras de productos, botones de tallas por artículo, equilibrio de etiquetas y agrupación de productos y cantidades en el mensaje de WhatsApp. **No se han validado visualmente todos los dispositivos ni las fotografías remotas**, y no se ha desplegado un entorno de inventario o cobro real.
