<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Models\CustomerPackage;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    public function index()
    {
        // Load customer-package pivot records with related customer and package
        $customerPackages = CustomerPackage::with(['customer', 'package'])->withTrashed()->get();

        return inertia('packages/package-list', [
            'customerPackages' => $customerPackages,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:packages,name'],
            'price' => ['required', 'numeric', 'min:0'],
        ]);

        dd($validated);
    }
}
