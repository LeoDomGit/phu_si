<?php

namespace App\Models\Reviews;

use App\Models\Products\Products;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Customers\Customers;
class Reviews extends Model
{
    use HasFactory;
    protected $table='reviews';
    protected $fillable=['id','id_customer','id_product','star','review','status','created_at','updated_at'];

    public function customer(){
        return $this->belongsTo(Customers::class,'id_customer');
    }
    public function products(){
        return $this->belongsTo(Products::class,'id_product');
    }
}
