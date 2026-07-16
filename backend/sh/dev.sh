php artisan db:wipe --force

php artisan db:wipe --database=telescope --force

php artisan config:clear
php artisan route:clear
php artisan event:clear
php artisan view:clear

composer install

sh sh/update.sh

php artisan db:seed --class=DevDatabaseSeeder --force

