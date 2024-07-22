<?php

namespace App\Models\Carts;

use App\Models\Customers\Customers;
use App\Models\Products\Products;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Carts extends Model
{
    use HasFactory;
    protected $table='carts';
    protected $fillable = [
        'id_customer',
        'id_product',
        'quantity',
        'created_at',
        'updated_at',
    ];
    public function customer (){
        return $this->belongsTo(Customers::class,'id_customer');
    }
    public function products(){
        return $this->belongsTo(Products::class,'id_product');
    }
}
