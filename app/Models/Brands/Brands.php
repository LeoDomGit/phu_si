<?php

namespace App\Models\Brands;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Brands extends Model
{
    use HasFactory;
    protected $table='brands';
    protected $fillable=['id','name','slug','content','position','status','created_at','updated_at'];
    public function scopeActive(Builder $query){
        return $query->where('status', 1);
    }
    public function scopeSort(Builder $query,$param){
        return $query->where('status',1)->orderBy('position',$param);
    }
}
