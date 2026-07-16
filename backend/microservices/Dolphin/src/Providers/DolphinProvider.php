<?php

namespace DolphinMicroservice\Providers;

use Illuminate\Routing\Router;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

use Illuminate\Auth\RequestGuard;
use Illuminate\Support\Facades\Auth;

class DolphinProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot(Router $router)
    {
        Route::group([], __DIR__ . '/../Routes/api.php');
    }

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->registerConfig();
    }

    /**
     * Register package config.
     *
     * @return void
     */
    protected function registerConfig()
    {
        $this->mergeConfigFrom(
            dirname(__DIR__) . '/Config/dolphin.php',
            '62dolphin'
        );
    }


}
