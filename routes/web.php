<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\EventController as AdminEventController;
use App\Http\Controllers\Admin\ScanQRController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SuperAdmin\AdminController;
use App\Http\Controllers\SuperAdmin\DashboardController as SuperadminDashboardController;
use App\Http\Controllers\SuperAdmin\EventController as SuperAdminEventController;
use App\Http\Controllers\User\DashboardController as UserDashboardController;
use App\Http\Controllers\User\EventController as UserEventController;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

Route::get('/dashboard', function () {
    if (Gate::allows('admin')) {
        return redirect()->route('admin.dashboard');
    } elseif (Gate::allows('superadmin')) {
        return redirect()->route('superadmin.dashboard');
    }

    return redirect()->route('user.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// ----------------------
// User Routes
// ----------------------
Route::middleware(['auth', 'verified', 'can:user'])->prefix('user')->name('user.')->group(function () {

    Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');

    Route::resource('/event', UserEventController::class);
    Route::post('/event/{eventId}/register', [UserEventController::class, 'register'])->name('event.register');
    Route::get('/user/event/my-events', [UserEventController::class, 'myevents'])->name('event.myevents');
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notification.index');
});

// ----------------------
// Admin Routes
// ----------------------
Route::middleware(['auth', 'verified', 'can:admin'])->prefix('admin')->name('admin.')->group(function () {

    Route::get('/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');

    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::resource('event', AdminEventController::class);
    Route::get('/scanqr', [ScanQRController::class, 'index'])->name('scan-qr.index');
});

// ----------------------
// Super Admin Routes
// ----------------------
Route::middleware(['auth', 'verified', 'can:superadmin'])->prefix('superadmin')->name('superadmin.')->group(function () {

    Route::get('/dashboard', [SuperadminDashboardController::class, 'index'])->name('dashboard');

    Route::resource('event', SuperAdminEventController::class);
    Route::patch('/event/{event}/approve-event', [SuperAdminEventController::class, 'approve_event'])->name('event.approve');
    Route::patch('/event/{event}/reject-event', [SuperAdminEventController::class, 'reject_event'])->name('event.reject');
    Route::resource('admin', AdminController::class);
    Route::patch('/admin/{admin}/restore', [AdminController::class, 'restore'])->name('admin.restore');
});

require __DIR__.'/settings.php';
