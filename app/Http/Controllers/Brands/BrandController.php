<?php

namespace App\Http\Controllers\Brands;

use App\Http\Controllers\Controller;
use App\Models\Brands\Brands;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Traits\HasCrud;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brands = $this->getAll();
        return Inertia::render('Brands/Brands',['brands'=>$brands]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function getAll(){
        return Brands::orderBy('position','asc')->get();
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
            'name' => 'required',
            'content'=>'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $data=$request->all();
        $data['slug']= Str::slug($request->name);
        $data['created_at']= now();
        Brands::create($data);
        $brands=$this->getAll();
        return response()->json(['check'=>true,'data'=>$brands]);

    }

    /**
     * Display the specified resource.
     */
    public function show(Brands $brands,$id)
    {
        $brand = Brands::find($id);
        return Inertia::render('Brands/Edit',['id'=>$id,'brands'=>$brand]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Brands $brands,$id)
    {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Brands $brands,$id)
    {
        $data=$request->all();
        if($request->has('name')){
            $data['slug']=Str::slug($request->name);
        }
        $brand=Brands::find($id);
        if(!$brand){
            return response()->json(['check'=>false,'msg'=>'Không tìm thấy thương hiệu sản phẩm']);
        }
        Brands::where('id',$id)->update($data);
        $brands=$this->getAll();
        return response()->json(['check'=>true,'data'=>$brands]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brands $brands)
    {
        //
    }
}
