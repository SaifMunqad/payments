<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        Schema::create('customer_packages', function (Blueprint $table) {
            $table->id();

            $table->foreignId('customer_id')->constrained('customers');
            $table->foreignId('package_id')->constrained('packages');

            $table->unsignedSmallInteger('package_price');
            $table->enum('currency', ['AFN', 'USD'])->default('AFN');

            $table->enum('status', ['active', 'inactive'])->default('active');


            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_packages');
    }

};
