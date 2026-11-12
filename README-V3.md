# HEADS FIT V3 · Colecciones y marcas

## Experiencia de catálogo
- 72 fichas orientativas: 36 prendas, 20 suplementos y 16 accesorios.
- 26 registros heredados de HEADS FIT y 46 referencias nuevas.
- `catalogo.html`: catálogo conjunto. `marcas.html`: tarjetas enlazadas a `catalogo.html?marca=NIKE` u otras marcas.
- Filtro por marca y categoría, búsqueda de texto sin distinguir tildes, ordenación, contador en tiempo real y estado sin coincidencias.
- Ficha rápida con fotografía, descripción y recomendaciones; artículos relacionados por acceso a marca.
- Bolsa persistente en el navegador con cantidades, selección de tallas para prendas, y mensaje de pedido por WhatsApp a **+593 98 355 1261**.
- Los botones de compra **no cobran ni envían solos**: preparan una consulta y el cliente debe confirmar el envío en WhatsApp.
- CSS responsive para escritorio, tablet y teléfono, animaciones moderadas y compatibilidad con preferencias de movimiento reducido.
- La interfaz existente de HEADS FIT se conserva y amplía, usando la biblioteca GSAP/ScrollTrigger ya instalada.

## Edición de productos
El origen único está en `assets/js/productos.js`. Cada elemento contiene id, tipo (`ropa`, `suplementos`, `accesorios`), nombre, marca, categoria, descripcion, detalles, consejo, imagen y etiqueta. Las tarjetas de catálogo y marcas se derivan de este archivo automáticamente. Para futuras mejoras, se recomienda convertir este archivo en JSON y crear un panel con autenticación y base de datos.

## Importante antes de abrir la tienda al público
- Las fichas son una **selección de referencia**, no una afirmación de inventario, precio, asociación ni distribución autorizada de esas marcas.
- Hay fotografías de referencia procedentes del demo o de enlaces externos; varias tarjetas usan imágenes genéricas y no ilustran exactamente el modelo indicado. Sustituirlas por fotografías propias/autorizadas que correspondan a cada producto real, y probar todas las direcciones de imagen.
- Revisar nombres y disponibilidad de modelos frente al inventario propio antes de ofrecerlos.
- El carrito se guarda localmente; no hay gestión de pedidos, stock compartido, pasarela de pagos, autenticación ni panel de administración real.

## Probar y publicar
Abrir `catalogo.html`, probar marcas/filtros y añadir productos de diferentes categorías; desde «MI BOLSA» abrir WhatsApp y verificar los artículos y cantidades. Verificar visualmente en teléfono, tablet y computadora.
GitHub Pages puede publicar el repositorio desde `main` y `/(root)`, después de fusionar la solicitud y verificar las imágenes y permisos de uso.

## Archivos principales
- `assets/js/productos.js` catálogo.
- `assets/js/shop.js` filtros, enlaces, interfaz de marcas, modales y bolsa.
- `assets/css/v3.css` estilos.
- `catalogo.html` catálogo general.
- `marcas.html` directorio de marcas.
