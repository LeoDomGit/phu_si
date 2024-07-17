<?php

namespace Leo\Roles\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Leo\Users\Models\User;
use Leo\Permissions\Models\Permission;

class Roles extends Model
{
    use HasFactory;
    protected $table='roles';
    protected $fillable = [	'id','name','guard_name','created_at','updated_at'];

    public function users()
    {
        return $this->hasMany(User::class, 'idRole');
    }

    public function permission()
    {
        return $this->belongsToMany(Permission::class, 'role_has_permissions','role_id');
    }
}
