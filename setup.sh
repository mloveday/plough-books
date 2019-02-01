#!/usr/bin/env bash

echo "Getting Composer..."
./scripts/getComposer.sh
echo "Done getting composer"

echo "Installing dependencies..."
php composer.phar install
echo "Done installing dependencies"

echo "Optimising Symfony..."
php composer.phar dump-autoload --optimize --no-dev --classmap-authoritative
echo "Done optimising Symfony"

cp /home/dashboard/deploy_resources/.env ./env
cp -r ./test/output/ ./public/build/test