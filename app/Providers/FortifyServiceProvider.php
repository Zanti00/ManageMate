<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
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
        $this->configureActions();
        $this->configureViews();
        $this->configureAuthentication();
        $this->configureRateLimiting();
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::createUsersUsing(CreateNewUser::class);
    }

    private function configureAuthentication(): void
    {
        Fortify::authenticateUsing(function (Request $request) {
            $user = User::where('email', $request->input('email'))->first();

            if (! $user) {
                return null;
            }

            // Block deleted users from authenticating
            if ((int) ($user->is_deleted ?? 0) === 1) {
                return null;
            }

            return Hash::check($request->password, $user->password)
                ? $user
                : null;
        });
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        Fortify::loginView(function (Request $request) {
            return $this->renderInertiaNoCache($request, 'auth/login', [
                'canResetPassword' => Features::enabled(Features::resetPasswords()),
                'canRegister' => Features::enabled(Features::registration()),
                'status' => $request->session()->get('status'),
            ]);
        });

        Fortify::resetPasswordView(function (Request $request) {
            return $this->renderInertiaNoCache($request, 'auth/reset-password', [
                'email' => $request->email,
                'token' => $request->route('token'),
            ]);
        });

        Fortify::requestPasswordResetLinkView(function (Request $request) {
            return $this->renderInertiaNoCache($request, 'auth/forgot-password', [
                'status' => $request->session()->get('status'),
            ]);
        });

        Fortify::verifyEmailView(function (Request $request) {
            return $this->renderInertiaNoCache($request, 'auth/verify-email', [
                'status' => $request->session()->get('status'),
            ], redirectWhenAuthenticated: false);
        });

        Fortify::registerView(function (Request $request) {
            return $this->renderInertiaNoCache($request, 'auth/register');
        });

        Fortify::twoFactorChallengeView(function (Request $request) {
            return $this->renderInertiaNoCache($request, 'auth/two-factor-challenge', redirectWhenAuthenticated: false);
        });

        Fortify::confirmPasswordView(function (Request $request) {
            return $this->renderInertiaNoCache($request, 'auth/confirm-password', redirectWhenAuthenticated: false);
        });
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });
    }

    private function redirectIfAuthenticated()
    {
        return Auth::check() ? redirect()->route('dashboard') : null;
    }

    private function renderInertiaNoCache(Request $request, string $component, array $props = [], bool $redirectWhenAuthenticated = true)
    {
        if ($redirectWhenAuthenticated && ($redirect = $this->redirectIfAuthenticated())) {
            return $redirect;
        }

        $response = Inertia::render($component, $props)
            ->toResponse($request);

        $response->headers->add($this->noCacheHeaders());

        return $response;
    }

    private function noCacheHeaders(): array
    {
        return [
            'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma' => 'no-cache',
        ];
    }
}
