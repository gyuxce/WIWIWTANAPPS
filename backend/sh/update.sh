composer dump-autoload

sh sh/migrate.sh

php artisan telescope:install
php artisan horizon:install
php artisan route:clear
php artisan route:cache
#php artisan passport:install --force
#php artisan key:generate --force

php artisan storage:link
