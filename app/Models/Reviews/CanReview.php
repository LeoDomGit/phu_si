<?php

namespace App\Models\Reviews;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CanReview extends Model
{
    use HasFactory;
    protected $table='can_review';
    protected $fillable=['id','id_customer','id_bill','id_product','created_at','updated_at'];

}
