<?php

namespace App\Models\Collections;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Categories\Categories;
use Illuminate\Database\Eloquent\Builder;
use App\Models\Products\Products;
class ProductCollection extends Model
{
    use HasFactory;
    protected $table='collections';
    protected $fillable=['id','collection','slug','model','position','status','highlighted','created_at','updated_at'];

    public function scopeActive(Builder $query){
        return $query->where('status', 1);
    }

    public function scopeSort(Builder $query,$param){
        return $query->where('status',1)->orderBy('position',$param);
    }

    public function scopeHighlight(Builder $query){
        return $query->where('status',1)->where('highlighted',1)->orderBy('position','asc');
    }
    public function categories (){
        return $this->hasMany(Categories::class,'id_collection');
    }

    public function products()
    {
        return $this->belongsToMany(Products::class, 'links', 'id_parent', 'id_link');
    }
}
