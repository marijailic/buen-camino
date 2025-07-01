#!/bin/bash

~/bin/composer install --optimize-autoloader --no-dev --no-interaction --no-ansi

php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

php artisan view:cache
php artisan route:cache
php artisan config:cache

php artisan migrate --force
php artisan queue:restart

php artisan up

if [ -d "vendor" ]; then
  php artisan down
  php artisan config:clear
fi
