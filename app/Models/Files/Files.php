<?php

namespace App\Models\Files;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Files extends Model
{
    use HasFactory;
    protected $table='images';
    protected $fillable=['id','filename','folder_id','created_at','updated_at'];
    public function folder (){
        return $this->belongsTo(Folders::class, 'folder_id');
    }
}
