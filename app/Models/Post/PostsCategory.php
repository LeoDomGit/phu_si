<?php

namespace App\Models\Post;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostsCategory extends Model
{
    use HasFactory;

    protected $table = 'post_categories';
    protected $fillable = ['title', 'slug', 'summary', 'status', 'id_collection', 'position', 'created_at', 'updated_at'];

    // public function collection()
    // {
    //     return $this->belongsTo(PostsCollection::class, 'id_collection');
    // }

    public function posts()
    {
        return $this->hasMany(Posts::class, 'id_category', 'id');
    }
}
