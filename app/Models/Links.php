<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Links extends Model
{
    use HasFactory;
    protected $table='links';
    protected $fillable=['id','id_link','id_parent','model1','model2','created_at','updated_at'];
}
