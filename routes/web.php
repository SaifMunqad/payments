<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return inertia('auth/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('customers', 'dashboard/customers')->name('customers');
    Route::post('customers', 'CustomersController@store');
    Route::post('customers/import', 'CustomersController@import');
});

require __DIR__.'/settings.php';