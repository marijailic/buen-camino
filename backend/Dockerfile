FROM richarvey/nginx-php-fpm:3.1.6

# Copy application files into the correct folder
COPY . /var/www/html

COPY entrypoint.sh /var/www/html/scripts/entrypoint.sh
RUN chmod +x /var/www/html/scripts/entrypoint.sh

# Image config
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1

# Laravel config
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr

# Allow composer to run as root
ENV COMPOSER_ALLOW_SUPERUSER 1

# Default start
CMD ["/start.sh"]
