<?php

use App\Http\Controllers\CustomersController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }

    return inertia('auth/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return inertia('dashboard');
    })->name('dashboard');

    Route::get('customers', [CustomersController::class, 'index'])->name('customers');
    Route::inertia('customers/create', 'dashboard/create-customer')->name('customers.create');
    Route::inertia('customers/import', 'dashboard/import-customers')->name('customers.import');
    Route::post('customers', [CustomersController::class, 'store']);
    Route::post('customers/import', [CustomersController::class, 'import']);
});

require __DIR__.'/settings.php';
