<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Package extends Model
{
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'price',
    ];

    /**
     * Define the relationship with the CustomerPackage model.
     */
    public function customerPackages(): HasMany
    {
        return $this->hasMany(CustomerPackage::class);
    }

    /**
     * Define the relationship with the Payment model.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
