FIT CULTURE 2.0 — SITIO WEB ESTÁTICO HTML / CSS / JAVASCRIPT
=============================================================

CONTENIDO
- index.html: portada y enlace destacado hacia los catálogos.
- ropa.html: 10 artículos, filtros, búsqueda, ordenación, fichas de detalle.
- suplementos.html: 8 artículos con información general y recomendaciones cautelosas.
- accesorios.html: 8 artículos con fichas informativas.
- marcas.html: directorio de marcas del diseño original.
- assets/css/style.css: diseño responsive, animaciones y modal.
- assets/js/main.js: menú, filtros iniciales y animaciones GSAP.
- assets/js/catalog.js: búsqueda, filtros combinados, ordenación y fichas sin backend.

USO LOCAL
Descomprime el ZIP y abre index.html en el navegador.
Mantén la estructura de carpetas y rutas relativa.

PUBLICACIÓN GRATUITA EN GITHUB PAGES
1. Crea un repositorio público en GitHub.
2. Sube el CONTENIDO de la carpeta fit_culture (index.html en la raíz).
3. En Settings > Pages, selecciona Deploy from a branch, main y /(root).
4. Visita https://TU-USUARIO.github.io/NOMBRE-REPOSITORIO/.

NOTAS IMPORTANTES
- HTML puro con CSS y JavaScript. No utiliza PHP, React ni base de datos.
- Los datos descriptivos explican la clase de artículo, no acreditan materiales,
  dosis, tallas, capacidades, garantías ni desempeño de modelos reales.
- Los nombres de marcas, modelos e imágenes vienen del ZIP original y son
  referenciales; no suponen distribución, autorización ni disponibilidad real.
- Reemplaza las fotografías de Unsplash por imágenes propias o con licencia
  que correspondan al producto antes de usarlo como catálogo comercial.
- Si se usan nombres de marcas, verifica la relación comercial antes de publicar.
- Las fotos, fuentes Google y GSAP se cargan desde Internet.
- No incluye pasarela de pagos ni pedidos; los contactos siguen sin configurarse.
- No contiene precios inventados.

EDITAR PRODUCTOS
Busca el bloque <article class="product-card"> en cada archivo HTML.
Modifica data-name, data-description, data-features, data-advice, data-brand,
la categoría, el título visible y la imagen correspondiente.
Mantén sincronizados los valores para que la ficha y la búsqueda sean correctas.
