#!/bin/bash

echo "Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader

php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

php artisan migrate --force

# Avoid crashing if faker fails
php artisan db:seed --force || true
