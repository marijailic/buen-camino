FROM richarvey/nginx-php-fpm:3.1.6

COPY . /var/www/html

RUN chown -R www-data:www-data /var/www/html

# Laravel expects public folder
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV REAL_IP_HEADER 1

ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr
ENV COMPOSER_ALLOW_SUPERUSER 1

# Install composer dependencies and optimize during build
RUN composer install --no-dev --optimize-autoloader && \
    php artisan optimize:clear && \
    php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan migrate --force || true && \
    php artisan db:seed --force || true

RUN cat /etc/nginx/sites-enabled/default
RUN ls -lah /var/www/html/public
