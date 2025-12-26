<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        Gate::define('admin', fn ($user) => $user->role === 'admin');
        Gate::define('user', fn ($user) => $user->role === 'user');
        Gate::define('superadmin', fn ($user) => $user->role === 'superadmin');
    }
}
