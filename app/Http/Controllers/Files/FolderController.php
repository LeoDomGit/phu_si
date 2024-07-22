<?php

namespace App\Http\Controllers\Files;

use App\Http\Controllers\Controller;
use App\Models\Files\Folders;
use App\Models\Files\Files;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class FolderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $files= Files::with('folder')->get();

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
            'name' => 'required|unique:folders,name',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $data=$request->all();
        $data['created_at']=now();
        Folders::create($data);
        $folders= Folders::all();
        return response()->json(['check'=>true,'data'=>$folders]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Folders $folders,$id)
    {

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Folders $folders)
    {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Folders $folders,$id)
    {
        $folder=Folders::find($id);
        if(!$folder){
            return response()->json(['check'=>false,'msg'=>'Không tìm thấy mã thư mục']);
        }
        $data=$request->all();
        $data['updated_at']= now();
        Folders::where('id',$id)->update($data);
        $folders= Folders::all();
        return response()->json(['check'=>true,'data'=>$folders]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Folders $folders,$id)
    {
        $folder=Folders::find($id);
        if(!$folder){
            return response()->json(['check'=>false,'msg'=>'Không tìm thấy mã thư mục']);
        }
        $check=Files::where('folder_id',$id)->first();
        if($check){
            return response()->json(['check'=>false,'msg'=>'Còn hình trong thư mục này']);
        }
        Folders::where('id',$id)->delete();
        $folders= Folders::all();
        return response()->json(['check'=>true,'data'=>$folders]);
    }
}
