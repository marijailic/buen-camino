FROM richarvey/nginx-php-fpm:3.1.6

# Copy the app into the container
COPY . /var/www/html

# Set ownership
RUN chown -R www-data:www-data /var/www/html

# Laravel expects public folder
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1

ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr
ENV COMPOSER_ALLOW_SUPERUSER 1

COPY entrypoint.sh /var/www/html/scripts/entrypoint.sh
RUN chmod +x /var/www/html/scripts/entrypoint.sh
