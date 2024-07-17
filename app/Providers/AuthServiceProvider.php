<?php
namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\Roles;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        // 'App\Model' => 'App\Policies\ModelPolicy',
    ];

    public function boot(): void
    {
        $this->registerPolicies();

        $roles = Roles::with('permissions')->get();

        $permissionArray = [];

        foreach ($roles as $role) {
            foreach ($role->permissions as $permission) {
                $permissionArray[$permission->name][] = $permission->id;
            }
        }

        foreach ($permissionArray as $permissionName => $permissionIds) {
            Gate::define($permissionName, function ($user) use ($permissionIds) {
                $role = Cache::remember('user_role_' . $user->id, 3600, function () use ($user) {
                    return Roles::findOrFail($user->idRole);
                });

                // Check if the user has the required permission
                $userPermissions = $role->permissions->pluck('id')->toArray();
                return in_array($permissionIds[0], $userPermissions);
            });
        }
    }
}
