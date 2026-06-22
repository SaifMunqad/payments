<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('username')->unique();
            $table->unsignedSmallInteger('customer_id');
            $table->string('firstname', 50);
            $table->string('lastname', 50);

            //
            /*$table->foreignId('package_id')->constrained('packages');
            $table->unsignedSmallInteger('package_price');
            $table->enum('currency', ['AFN', 'USD'])->default('AFN');*/
            $table->date('discount_date')->nullable();

            //
            $table->string('previous_package')->nullable();
            $table->unsignedSmallInteger('previous_package_price')->nullable();
            $table->date('package_change_date')->nullable();

            //
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
