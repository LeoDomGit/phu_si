<?php

namespace App\Models\Files;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Folders extends Model
{
    use HasFactory;
    protected $table='folders';
    protected $fillable=['id','name','created_at','updated_at'];
    public function file (){
        return $this->hasMany(Files::class);
    }
}
