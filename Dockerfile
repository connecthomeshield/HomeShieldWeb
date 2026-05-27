# Use the official lightweight PHP 8.2 image with Apache pre-installed
FROM php:8.2-apache

# Enable the Apache rewrite module to allow custom routing rules if needed
RUN a2enmod rewrite

# ─── FIX: Suppress AH00558 "Could not reliably determine the server's fully
#     qualified domain name" warning by setting a global ServerName directive.
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# ─── FIX: Render expects the service to bind to the PORT environment variable
#     (default 10000). Apache defaults to port 80, causing the repeated
#     "Detected a new open port HTTP:80" messages. We use sed at container
#     startup to dynamically rewrite Apache's Listen directive to match $PORT.
#     The EXPOSE is set to 10000 as Render's default, but it's informational.
EXPOSE 10000

# Copy all project static files and the PHP script to the Apache document root
COPY . /var/www/html/

# Configure appropriate permissions for Apache
RUN chown -R www-data:www-data /var/www/html

# ─── ENTRYPOINT: Dynamically set Apache to listen on Render's $PORT at runtime
#     Falls back to port 10000 if PORT is not set (Render's default).
CMD sed -i "s/Listen 80/Listen ${PORT:-10000}/" /etc/apache2/ports.conf && \
    sed -i "s/<VirtualHost \*:80>/<VirtualHost *:${PORT:-10000}>/" /etc/apache2/sites-available/000-default.conf && \
    apache2-foreground
