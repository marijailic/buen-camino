FROM richarvey/nginx-php-fpm:3.1.6

COPY . /var/www/html

RUN chown -R www-data:www-data /var/www/html

COPY nginx.conf /etc/nginx/nginx.conf

ENV PHP_ERRORS_STDERR 1
ENV REAL_IP_HEADER 1

ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr
ENV COMPOSER_ALLOW_SUPERUSER 1

RUN composer install --no-dev --optimize-autoloader

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
