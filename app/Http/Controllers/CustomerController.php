<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\IOFactory;

class CustomerController extends Controller
{
    public function index()
    {

        // Fetch all customers from the database
        $customers = Customer::all();

        // Return the customers to the view
        return inertia('customers/customer-list', [
            'customers' => $customers,
        ]);
    }

    public function create()
    {
        // Return the customers to the view
        return Inertia::render('dashboard/create-customer');
    }

    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'username' => 'required|string|max:255|unique:customers,username',
            'customer_id' => 'required|integer|min:0|max:65535',
            'firstname' => 'required|string|max:50',
            'lastname' => 'required|string|max:50',
        ]);

        // Create the customer
        Customer::create($validated);

        // Redirect back with success message
        return redirect()->back()->with('success', 'Customer created successfully.');

    }

    public function storeImport(Request $request)
    {

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
        return Inertia::render('dashboard/import-customers', [
            'previewData' => $data,
            'file' => $file,
        ]);
    }

    public function createImport()
    {
        return inertia('dashboard/import-customers');
    }
}
