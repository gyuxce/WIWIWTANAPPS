php artisan db:wipe --force

php artisan db:wipe --database=telescope --force

php artisan config:clear
php artisan route:clear
php artisan event:clear
php artisan view:clear

composer install

composer install --optimize-autoloader --no-dev

sh sh/update.sh

php artisan db:seed --force

php artisan config:cache
php artisan route:cache
php artisan event:cache
php artisan view:cache
