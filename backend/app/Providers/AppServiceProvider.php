<?php

namespace App\Providers;

//use Laravel\Passport\Passport;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // The application's migrations are grouped by domain instead of
        // living directly under database/migrations.
        $this->loadMigrationsFrom([
            database_path('migrations/Base'),
            database_path('migrations/Finance'),
            database_path('migrations/Forum'),
            database_path('migrations/Master'),
            database_path('migrations/TableRefs'),
            database_path('migrations/Training'),
        ]);

        //Passport::ignoreRoutes();
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
