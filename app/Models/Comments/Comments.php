<?php

namespace App\Models\Comments;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Customers\Customers;
use App\Models\Products\Products;
class Comments extends Model
{
    use HasFactory;
    protected $table='comments';
    protected $fillable=['id','id_customer','id_product','comment','reply','status','created_at','updated_at'];

    public function customer()
    {
        return $this->belongsTo(Customers::class,'id_customer');
    }

    public function products(){
        return $this->belongsTo(Products::class,'id_product');
    }
}
