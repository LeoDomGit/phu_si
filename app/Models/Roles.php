<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Permissions;
class Roles extends Model
{
    use HasFactory;
    protected $table='roles';
    protected $fillable = [	'id','name','guard_name','created_at','updated_at'];

    public function users()
    {
        return $this->hasMany(User::class, 'idRole');
    }
    public function permissions()
    {
        return $this->belongsToMany(Permissions::class, 'role_has_permissions', 'role_id', 'permission_id');
    }
}
