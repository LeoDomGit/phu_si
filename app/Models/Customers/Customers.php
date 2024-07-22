<?php

namespace App\Models\Customers;

use App\Models\Products\Products;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Comments\Comments;

class Customers extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table='customers';
    protected $fillable=['id','name','address','password','phone','email','status','email_verified_at','created_at','updated_at'];

    public function cart(){
        return $this->hasMany(Customers::class);
    }

    public function comment(){
        return $this->hasMany(Comments::class);
    }
    public function canReviewProducts()
    {
        return $this->belongsToMany(Products::class, 'can_review', 'id_customer', 'id_product');
    }
}
