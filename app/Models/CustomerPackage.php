<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerPackage extends Model
{
    use SoftDeletes;

    protected $table = 'customer_packages';

    /**
     * The attributes that are mass-assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'package_price',
        'currency',
        'status',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'status' => 'string',
        'currency' => 'string',
    ];

    /**
     * Define the relationship with the Customer model.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Define the relationship with the Package model.
     */
    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }
}
