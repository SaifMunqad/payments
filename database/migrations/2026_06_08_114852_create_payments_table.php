<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            // by which user
            $table->foreignId('user_id')->constrained('users');

            $table->foreignId('customer_id')->constrained('customers');

            $table->string('payment_id', 12);

            $table->text('charge_comment');
            $table->text('finance_comment')->nullable();
            $table->text('support_review')->nullable();

            $table->date('payment_date');
            $table->date('start_date');
            $table->date('end_date');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
