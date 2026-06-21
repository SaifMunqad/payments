<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomersPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_users_can_view_the_customers_page(): void
    {
        $user = User::factory()->create();
        Customer::create([
            'username' => 'jane-doe',
            'customer_id' => 'C-1001',
            'firstname' => 'Jane',
            'lastname' => 'Doe',
        ]);

        $this->actingAs($user);

        $response = $this->get(route('customers'));

        $response->assertOk();
    }
}
