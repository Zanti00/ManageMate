<?php

use App\Http\Controllers\Admin\EventController as AdminEventController;
use App\Http\Controllers\Admin\ScanQRController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SuperAdmin\AdminManagementController;
use App\Http\Controllers\SuperAdmin\EventController as SuperAdminEventController;
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
        return Inertia::render('admin/dashboard');
    } elseif (Gate::allows('superadmin')) {
        return Inertia::render('superadmin/dashboard');
    }

    return Inertia::render('user/dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// ----------------------
// User Routes
// ----------------------
Route::middleware(['auth', 'verified', 'can:user'])->prefix('user')->name('user.')->group(function () {

    Route::get('/dashboard', function () {
        return Inertia::render('user/dashboard');
    })->name('dashboard');

    Route::get('/events', [UserEventController::class, 'index'])->name('event.index');

    Route::get('/notifications', [NotificationController::class, 'index'])->name('notification.index');
});

// ----------------------
// Admin Routes
// ----------------------
Route::middleware(['auth', 'verified', 'can:admin'])->prefix('admin')->name('admin.')->group(function () {

    Route::get('/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');

    Route::get('/events', [AdminEventController::class, 'index'])->name('event.index');
    Route::get('/events/create', [AdminEventController::class, 'create'])->name('event.create');
    Route::get('/events/view', [AdminEventController::class, 'view'])->name('event.view');
    Route::get('/scanqr', [ScanQRController::class, 'index'])->name('scan-qr.index');
});

// ----------------------
// Super Admin Routes
// ----------------------
Route::middleware(['auth', 'verified', 'can:superadmin'])->prefix('superadmin')->name('superadmin.')->group(function () {

    Route::get('/dashboard', function () {
        return Inertia::render('superadmin/dashboard');
    })->name('dashboard');

    Route::get('/events', [SuperAdminEventController::class, 'index'])->name('event.index');
    Route::get('/admins', [AdminManagementController::class, 'index'])->name('admins.index');
    Route::get('/admins/view', [AdminManagementController::class, 'edit'])->name('admins.view');
    Route::get('/admins/create', [AdminManagementController::class, 'create'])->name('admins.create');
});

require __DIR__.'/settings.php';
