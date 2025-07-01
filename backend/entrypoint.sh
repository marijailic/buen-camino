#!/bin/bash

cd ..

echo "Installing Composer dependencies..."
composer install

echo "Running Laravel migrations..."
php artisan migrate --force

echo "Running Laravel seeders..."
php artisan db:seed --force
