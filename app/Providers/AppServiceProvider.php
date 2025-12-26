<?php

namespace App\Providers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Inertia::share([
        //     'auth' => function () {
        //         $user = Auth::user();

        //         return [
        //             'user' => $user ? [
        //                 'id' => $user->id,
        //                 'name' => $user->name,
        //                 'email' => $user->email,
        //                 'isAdmin' => $user->can('admin'),  // Add this line!
        //                 // Include other fields you need
        //                 'created_at' => $user->created_at,
        //                 'updated_at' => $user->updated_at,
        //             ] : null,
        //         ];
        //     },
        // ]);
    }
}
