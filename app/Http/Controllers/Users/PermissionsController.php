<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Models\Permissions;
use App\Models\RoleHasPermission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Traits\HasCrud;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\Roles;

class PermissionsController extends Controller
{
    use HasCrud;
    /**
     * Display a listing of the resource.
     */

    public function index()
    {
        $permissions=Permissions::all();
        $roles=Roles::all();
        return Inertia::render('Permissions/Permissions',['permissions'=>$permissions,'roles'=>$roles]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function role_permission(Request $request){
        $validator = Validator::make($request->all(), [
            'role' => 'required|exists:roles,id',
            'permissions'=>'required|array',
            'permissions.*'=>'exists:permissions,id'
        ], [
            'role.required' => 'Chưa có loại tài khoản',
            'role.exists' => 'Mã loại tài khoản không hợp lệ',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        DB::table('role_has_permissions')
        ->where('role_id', $request->role)
        ->delete();
        foreach ($request->permissions as $value) {
            DB::table('role_has_permissions')->insert([
                'role_id' => $request->role,
                'permission_id' => $value
            ]);
        }
        $permissions = DB::table('role_has_permissions')
            ->where('role_id', $request->role)
            ->pluck('permission_id');

        return response()->json(['check'=>true,'permissions' => $permissions]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function get_permissions($id){
        $permissions = RoleHasPermission::where('role_id', $id)->pluck('permission_id');
        return response()->json(['permissions'=>$permissions]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:permissions,name',

        ], [
            'name.required' => 'Chưa nhận được quyền tài khoản',
            'name.unique' => 'Quyền tài khoản bị trùng',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $data = $request->all();
        $result =$this->storeTraits(Permissions::class, $data);
        return response()->json(['check'=>true,'data'=>$result]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Permissions $permissions)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Permissions $permissions)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Permissions $permissions,$id)
    {
        $validator = Validator::make($request->all(), [
            'permissions' => 'unique:permissions,name',
        ], [
            'permissions.unique' => 'Quyền tài khoản bị trùng',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $data = $request->all();
        $result =$this->updateTraits(Permissions::class,$id ,$data);
        $permissions= Permissions::all();
        return response()->json(['check'=> true,'data'=> $permissions]);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permissions $permissions)
    {
        //
    }
}
