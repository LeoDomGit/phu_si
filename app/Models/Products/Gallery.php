<?php

namespace App\Models\Products;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    use HasFactory;
    protected $table='gallery';
    protected $fillable=['id','model','image','id_parent','status','created_at','updated_at'];

    public function product()
    {
        return $this->belongsTo(Products::class, 'id_parent');
    }
}
