#!/bin/bash

# Run Laravel migrations
php artisan migrate --force

# Seed the database
php artisan db:seed --force
