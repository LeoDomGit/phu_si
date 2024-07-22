<?php

namespace App\Http\Controllers\Categories;

use App\Http\Controllers\Controller;
use App\Models\Categories\Categories;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Traits\HasCrud;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\Collections\ProductCollection;

class CategoriesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Categories::with(['parent','collection'])->get();
        $collections=ProductCollection::active()->get();
        $parentCategories = Categories::whereNull('id_parent')->get();
        $categories = $categories->map(function($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'status' => $category->status,
                'id_parent' => $category->id_parent,
                'position' => $category->position,
                'id_collection' => $category->id_collection,
                'created_at' => $category->created_at,
                'parent_name' => $category->parent ? $category->parent->name : '',
            ];
        });
        return Inertia::render('Collections/Categories',['categories'=>$categories,'collections'=>$collections,'parentCategories'=>$parentCategories]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $data = ProductCollection::all();
        $categories = Categories::select('id','name')->get();
        return Inertia::render('Collections/CreateCategories',['collections'=> $data,'categories'=>$categories]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'id_collection'=>'required|exists:collections,id',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $data=$request->all();
        $data['slug']= Str::slug($request->name);
        $data['created_at']= now();
        Categories::create($data);
        return response()->json(['check'=>true]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Categories $categories)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Categories $categories)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Categories $categories,$id)
    {
        $data=$request->all();
        if($request->has('name')){
            $data['slug']=Str::slug($request->name);
        }
        $collection=Categories::find($id);
        if(!$collection){
            return response()->json(['check'=>false,'msg'=>'Không tìm thấy danh mục sản phẩm']);
        }
        Categories::where('id',$id)->update($data);
        $categories = Categories::with('parent')->get();
        $categories = $categories->map(function($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'status' => $category->status,
                'id_parent' => $category->id_parent,
                'position' => $category->position,
                'id_collection' => $category->id_collection,
                'created_at' => $category->created_at,
                'parent_name' => $category->parent ? $category->parent->name : '',
            ];
        });
        return response()->json(['check'=>true,'data'=>$categories]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Categories $categories)
    {
        //
    }
}
