#!/bin/sh

# Run migrations and seeds
echo "Running migrations..."
php artisan migrate --force

echo "Running seeds..."
php artisan db:seed --force

# Start nginx and php-fpm
exec /start.sh
