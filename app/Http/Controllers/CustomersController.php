<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\DB;

class CustomersController extends Controller
{
    public function index()
    {
        // Check if user is authenticated
        $user = Auth::user();
        if (!$user) {
            return redirect('/login');
        }

        // Fetch all customers from the database
        $customers = Customer::all();

        // Return the customers to the view
        return Inertia::render('Dashboard/Customers', [
            'customers' => $customers,
        ]);
    }

    public function create()
    {
        // Check if user is admin
        $user = Auth::user();
        if (!$user || !$user->roles->contains('admin')) {
            return redirect('/dashboard');
        }

        // Return the customers to the view
        return Inertia::render('Dashboard/CreateCustomer');
    }

    public function store(Request $request)
    {
        // Check if user is admin
        $user = Auth::user();
        if (!$user || !$user->roles->contains('admin')) {
            return redirect('/dashboard');
        }

        // Validate the request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
        ]);

        // Create the customer
        $customer = Customer::create($validated);

        // Redirect back to customers page with success message
        return redirect()->route('customers')->with('success', 'Customer created successfully');
    }

    public function import(Request $request)
    {
        // Check if user is admin
        $user = Auth::user();
        if (!$user || !$user->roles->contains('admin')) {
            return redirect('/dashboard');
        }

        // Validate the request
        $request->validate([
            'file' => 'required|file|mimes:csv,xlsx,xls|max:2048',
        ]);

        // Process the file
        $file = $request->file('file');
        $filePath = $file->getRealPath();
        
        // Process CSV or Excel file
        if ($file->getClientOriginalExtension() === 'csv') {
            // Process CSV file
            $data = array_slice(array_map('str_getcsv', fopen($filePath, 'r')), 0, 5);
        } else {
            // Process Excel file
            $spreadsheet = IOFactory::load($filePath);
            $data = $spreadsheet->getActiveSheet()->toArray(null, true, true, true);
            $data = array_slice($data, 0, 5);
        }

        // Return the data to the view
        return Inertia::render('Dashboard/ImportCustomers', [
            'previewData' => $data,
            'file' => $file,
        ]);
    }
}