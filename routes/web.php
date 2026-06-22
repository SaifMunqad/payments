<?php

use App\Http\Controllers\CustomerController;
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

    // Customer-related routes. Note: the separate pages for creating/importing
    // customers were removed in favor of frontend modals that POST to the
    // existing store/storeImport endpoints below.
    Route::prefix('customers')->name('customers.')->group(function () {
        Route::get('/', [CustomerController::class, 'index'])->name('customers');
        Route::post('/', [CustomerController::class, 'store']);
        Route::post('import', [CustomerController::class, 'storeImport'])->name('customers.import.store');
    });

    // Packages and Payments pages (rendered by Inertia). The page components
    // should live at resources/js/pages/packages/package-list and
    // resources/js/pages/payments/payment-list respectively.
    Route::get('packages', function () {
        return inertia('packages/package-list');
    })->name('packages');

    Route::get('payments', function () {
        return inertia('payments/payment-list');
    })->name('payments');
});

require __DIR__.'/settings.php';
