#!/bin/bash

echo "Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader
composer require fakerphp/faker

# Clear all caches
php artisan optimize:clear

# Rebuild all caches
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Show routes (optional)
php artisan route:list

echo "Running Laravel migrations..."
php artisan migrate --force

echo "Running Laravel seeders..."
php artisan db:seed --force
