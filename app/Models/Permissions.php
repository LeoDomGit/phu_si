<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Roles;
class Permissions extends Model
{
    use HasFactory;
    protected $table='permissions';
    protected $fillable=['id','name','guard_name','created_at','updated_at'];

    public function roles()
    {
        return $this->belongsToMany(Roles::class, 'role_has_permissions', 'permission_id', 'role_id');
    }
}
