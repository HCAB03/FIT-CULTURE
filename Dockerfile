FROM nginx:stable-alpine

# Publicar el sitio HTML/CSS/JS que está en la raíz del repositorio.
COPY . /usr/share/nginx/html/

# Railway comprueba este endpoint antes de aceptar el despliegue.
RUN mkdir -p /usr/share/nginx/html/healthz \
    && printf 'OK\n' > /usr/share/nginx/html/healthz/index.html

EXPOSE 80
