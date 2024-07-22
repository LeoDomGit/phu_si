<?php

namespace App\Models\Post;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Posts extends Model
{
    use HasFactory;

    protected $table = 'posts';

    protected $fillable = ['title', 'slug', 'summary', 'image', 'content', 'status', 'highlighted', 'id_collection', 'view', 'id_category', 'position', 'created_at', 'updated_at'];

    public function category()
    {
        return $this->belongsTo(PostsCategory::class, 'id_category', 'id');
    }

    public function collection()
    {
        return $this->belongsTo(PostCollections::class, 'id_collection', 'id');
    }
}
