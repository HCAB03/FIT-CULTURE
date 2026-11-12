# HEADS FIT · Catálogo en español

Sitio estático basado en la interfaz original de FIT-CULTURE. Mantiene todas las secciones y productos existentes, añade seis prendas de la carpeta FORMA y añade una bolsa de pedido para WhatsApp.

## Pedidos

Botón «AÑADIR AL PEDIDO» en las fichas de ropa, suplementos y accesorios. Para ropa, el cliente elige talla. El pedido persiste en almacenamiento local del navegador y se genera como mensaje para WhatsApp al número +593 98 355 1261. **No se envía automáticamente**: WhatsApp abre el mensaje y la persona debe confirmar el envío. No hay pasarela de pago, inventario ni backend.

## Fotografías

Las seis imágenes de FORMA usan las URL de origen recogidas en su archivo assets-manifest.json del ZIP. El navegador necesita conexión a Internet para cargarlas. En el ZIP original están las imágenes locales; para una tienda comercial conviene reemplazarlas por fotografías propias/autorizadas. Si el proveedor retira una imagen, se muestra una imagen genérica de respaldo.

## Productos y precios

No se publican precios de demostración como reales. Todas las existencias, tallas, disponibilidad y valores se confirman por WhatsApp. La bolsa permite pedir un presupuesto, no descontar stock ni procesar una compra.

## Cómo editar

- Fichas originales: ropa.html, suplementos.html, accesorios.html.
- Seis prendas añadidas: bloque `extras` en assets/js/shop.js.
- Número para pedidos: `PHONE` en assets/js/shop.js.
- Estilos nuevos: assets/css/shop.css.
- Interfaz original: assets/css/style.css.

No es una tienda con administración real: para gestionar productos con datos compartidos, inventario seguro y pedidos automáticos se necesita backend y base de datos.
