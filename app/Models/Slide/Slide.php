<?php

namespace App\Models\Slide;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Slide extends Model
{
    use HasFactory;

    protected $table = 'slides';
    protected $fillable = ['name', 'slug', 'url', 'path', 'desktop', 'mobile', 'status', 'created_at', 'updated_at'];
}
