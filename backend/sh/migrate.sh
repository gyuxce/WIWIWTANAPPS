php artisan migrate --path=microservices/Dolphin/src/Database//Migrations/ --force
php artisan migrate --path=database/migrations/Base/ --force

php artisan migrate --path=database/migrations/Forum/ --force

php artisan migrate --path=database/migrations/Master/ --force

php artisan migrate --path=database/migrations/Training/ --force

php artisan migrate --path=database/migrations/Finance/ --force

php artisan migrate --path=database/migrations/TableRefs/ --force
php artisan migrate --force

