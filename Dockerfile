# Use the official lightweight PHP 8.2 image with Apache pre-installed
FROM php:8.2-apache

# Expose port 80 (standard HTTP port Render binds to)
EXPOSE 80

# Copy all project static files and the PHP script to the Apache document root
COPY . /var/www/html/

# Enable the Apache rewrite module to allow custom routing rules if needed
RUN a2enmod rewrite

# Configure Apache to listen on Port 80 and set appropriate permissions
RUN chown -R www-data:www-data /var/www/html
