#!/bin/bash

echo "Installing Composer dependencies..."
composer install

php artisan route:clear
php artisan config:clear
php artisan optimize:clear

echo "Running Laravel migrations..."
php artisan migrate:fresh --force

echo "Running Laravel seeders..."
php artisan db:seed --force
