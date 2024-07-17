<?php

namespace App\Models\Post;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostCollections extends Model
{
    use HasFactory;
    protected $table = 'post_collections';
    protected $fillable = ['name', 'slug', 'status', 'position', 'created_at', 'updated_at'];

    public function post()
    {
        return $this->hasMany(Posts::class, 'id_collection', 'id');
    }
}
