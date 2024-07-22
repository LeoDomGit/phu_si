<?php

namespace App\Models\Categories;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Collections\ProductCollection;
use Illuminate\Database\Eloquent\Builder;

class Categories extends Model
{
    use HasFactory;

    protected $table = 'categories';
    protected $fillable = [
        'id',
        'name',
        'slug',
        'status',
        'position',
        'id_parent',
        'id_collection',
        'created_at',
        'updated_at'
    ];
    public function collection()
    {
        return $this->belongsTo(ProductCollection::class, 'id_collection');
    }
    public function parent()
    {
        return $this->belongsTo(Categories::class, 'id_parent');
    }
    public function children()
    {
        return $this->hasMany(Categories::class, 'id_parent');
    }
    public function scopeActive(Builder $query){
        return $query->where('status', 1);
    }
}

