<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Models\Products\Products;
use Illuminate\Http\Request;
use App\Models\Collections\ProductCollection;
use Inertia\Inertia;
use App\Models\Categories\Categories;
use App\Models\Brands\Brands;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\Products\Gallery;
use App\Models\Links;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ProductExample;
use App\Imports\ProductsImport;

class ProductsController extends Controller
{


    /**
     * Display a listing of the resource.
     */

     public function index (){
        $products = Products::with(['image' => function($query) {
            $query->where('status', 1);
        }])
        ->select('products.*')
        ->get();
        $brands = Brands::select('id','name')->get();
        return Inertia::render('Products/Index',['products'=>$products,'brands'=>$brands]);

     }
       /**
     * Display a listing of the resource.
     */
     public function api_search_products(Products $products,$id)
     {
        $products = Products::where('status', 1)
        ->where(function($query) use ($id) {
            $query->where('slug', 'like', '%' . $id . '%')
                  ->orWhere('name', 'like', '%' . $id . '%');
        })
        ->with(['image' => function($query) {
            $query->where('status', 1);
        }])
        ->select('products.*')
        ->paginate(4);
         return response()->json($products);
     }
    /**
     * Display a listing of the resource.
     */
    public function import(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|mimes:xlsx',

        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        Excel::import(new ProductsImport, $request->file);
        return response()->json(['check'=>true]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $brands=Brands::active()->select('id','name')->get();
        $categories=Categories::active()->select('id','name')->get();
        $collections=ProductCollection::active()->where('model','ProductCollection')->select('id','collection')->get();
        $allCollecions=ProductCollection::active()->select('id','collection')->get();
        return Inertia::render('Products/Create',['categories'=>$categories,'brands'=>$brands,'collections'=>$collections,'allCollecions'=>$allCollecions]);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'sku' => 'required',
            'price' => 'required',
            'compare_price' => 'required',
            'attributes' => 'required',
            'discount' => 'required',
            'description'=>'required',
            'content'=>'required',
            'id_brand'=>'required|exists:brands,id',
            'instock'=>'required|numeric',
            'images'=>'required|array',
            'collections'=>'required|array'
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $data['name']=$request->name;
        $data['slug']=Str::slug($request->name);
        $data['sku']=$request->sku;
        $data['price']=$request->price;
        $data['compare_price']=$request->compare_price;
        $data['attributes']=$request->get('attributes');
        $data['discount']=$request->discount;
        $data['description']=$request->description;
        $data['content']=$request->content;
        $data['id_brand']=$request->id_brand;
        $data['in_stock']=$request->instock;
        $data['created_at']=now();
        $id=Products::insertGetId($data);
        $images=$request->images;
        $collections = $request->collections;
        foreach ($images as $key => $value) {
            Gallery::create(['model'=>'PRODUCT','image'=>$value,'id_parent'=>$id,'status'=>0,'created_at'=>now()]);
        }
        foreach ($collections as $value) {
            Links::create(['id_link'=>$id,'id_parent'=>$value,'model1'=>'PRODUCTS','model2'=>'COLLECTIONS','created_at'=>now()]);
        }
        return response()->json(['check'=>true]);
    }
    /**
     * Display the specified resource.
     */
    public function Delete_Image($id,Request $request){
        $id_parent = Gallery::where('id',$id)->value('id_parent');
        Gallery::where('id',$id)->delete();
        $gallery=Gallery::where('model','PRODUCT')->where('id_parent',$id_parent)->select('image','id','status')->get();
        return response()->json(['check'=>true,'data'=>$gallery]);
    }
        /**
     * Display the specified resource.
     */
    public function Set_Default($id,Request $request){
        $id_parent = Gallery::where('id',$id)->value('id_parent');
        Gallery::where('id_parent',$id_parent)->where('id','!=',$id)->update(['status'=>0,'updated_at'=>now()]);
        Gallery::where('id',$id)->update(['status'=>1,'updated_at'=>now()]);
        $gallery=Gallery::where('model','PRODUCT')->where('id_parent',$id_parent)->select('image','id','status')->get();

        return response()->json(['check'=>true,'data'=>$gallery]);
    }
     /**
     * Display the specified resource.
     */
    public function Update_Images(Request $request,$id){
        $validator = Validator::make($request->all(), [
            'images'=>'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        Gallery::create(['model'=>'PRODUCT','image'=>$request->images,'id_parent'=>$id,'status'=>0,'created_at'=>now()]);
        $gallery=Gallery::where('model','PRODUCT')->where('id_parent',$id)->select('image','id')->get();
        return response()->json(['check'=>true,'data'=>$gallery]);

    }
    /**
     * Display the specified resource.
     */
    public function show(Products $products,$id)
    {
        $brands=Brands::active()->select('id','name')->get();
        $categories=Categories::active()->select('id','name')->get();
        $product=Products::find($id)->first();
        $gallery=Gallery::where('model','PRODUCT')->where('id_parent',$id)->select('image','id','status')->get();
        $collections=ProductCollection::active()->where('model','ProductCollection')->select('id','collection')->get();
        $idCollections = Links::where('model1', 'PRODUCTS')
            ->where('model2', 'COLLECTIONS')
            ->where('id_link', $id)
            ->pluck('id_parent');
        $id_products = Links::where('model1', 'PRODUCTS')
        ->where('model2', 'PRODUCTS')
        ->where('id_link', $id)
        ->pluck('id_parent');
        $attributes =json_decode($product->attributes);
        if(!$product->attributes && count($attributes)==0){
            $dataattributes=[];
        }else{
            $dataattributes=$attributes ;
        }
        $products=Products::select('name','id')->get();
        $allCollecions=ProductCollection::active()->select('id','collection')->get();
        return Inertia::render('Products/Edit',['idProducts'=>$id_products,'products'=>$products,'dataattributes'=>$dataattributes,'dataidCollections'=>$idCollections,'id'=>$id,'product'=>$product,'gallery'=>$gallery,'categories'=>$categories,'brands'=>$brands,'collections'=>$collections,'allCollecions'=>$allCollecions,'datacontent'=>$product->content,'datadescription'=>$product->description]);
    }

    public function exportExample(Products $products)
    {
        return Excel::download(new ProductExample, 'products.xlsx');
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Products $products,$id)
    {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Products $products,$id)
    {
        $product=Products::find($id)->first();
        if(!$product){
            return response()->json(['check'=>false,'msg'=>'Không tim thấy mã sản phẩm']);
        }
        $data=$request->all();
        unset($data['collections']);
        unset($data['links']);
        if($request->has('name')){
        $data['slug']=Str::slug($request->name);
        }
        $data['updated_at']=now();
        Products::where('id',$id)->update($data);
        if($request->has('collections')){
            $collections = $request->collections;
            Links::where('id_link',$id)->delete();
            foreach ($collections as $value) {
                Links::create(['id_link'=>$id,'id_parent'=>$value,'model1'=>'PRODUCTS','model2'=>'COLLECTIONS','created_at'=>now()]);
            }
        }
        if($request->has('links')){
            Links::where('id_link',$id)->where('model2','PRODUCTS')->delete();
            $links = $request->links;
            foreach ($links as $value) {
                Links::create(['id_parent'=>$value,'id_link'=>$id,'model1'=>'PRODUCTS','model2'=>'PRODUCTS','created_at'=>now()]);
            }
        }
        $products = Products::with(['image' => function($query) {
            $query->where('status', 1);
        }])
        ->select('products.*')
        ->get();
        return response()->json(['check'=>true,'data'=>$products]);
    }


    //================================================================
    public function api_import(Request $request){
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'sku' => 'required',
            'price' => 'required',
            'compare_price' => 'required',
            'discount' => 'required',
            'brand'=>'required',
            'image'=>'required',
            'collection'=>'required'
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }
        $id_brand=Brands::where('name',$request->brand)->value('id');
        $data=$request->all();
        $data['slug']=Str::slug($request->name);
        unset($data['brand']);
        unset($data['image']);
        unset($data['collection']);
        $data['id_brand']=$id_brand;
        $data['created_at']= now();
        $product=Products::where('slug',Str::slug($request->name))->first();
        if(!$product){
            $id=Products::insertGetId($data);
            $id_collection= ProductCollection::where('slug','like','%'.$request->collection.'%')->value('id');
            Links::create(['id_link'=>$id,'id_parent'=>$id_collection,'model1'=>'PRODUCTS','model2'=>'COLLECTIONS','created_at'=>now()]);
            Gallery::create(['model'=>'PRODUCT','image'=>$request->image,'id_parent'=>$id,'status'=>1,'created_at'=>now()]);
            return response()->json(['check'=>true]);
        }else{
            return response()->json(['check'=>false]);

        }

    }
         /**
     * Remove the specified resource from storage.
     */
    public function api_categories_products($id){
        $collections = ProductCollection::where('status', 1)
        ->where('slug', $id)
        ->with(['products' => function($query) {
            $query->where('products.status', 1)
                  ->where('products.highlighted', 1)
                  ->with('image')
                  ->select('products.*')
                  ->distinct('products.id');
        }])
        ->get();
        return response()->json($collections);
    }
     /**
     * Remove the specified resource from storage.
     */
    public function api_all_products(Request $request){
        $query = Products::where('products.status', 1)
        ->where('products.highlighted', 1)
        ->with('image')
        ->join('links','products.id','=','links.id_link')
        ->join('collections','links.id_parent','=','collections.id')
        ->where('collections.status', 1)
        ->select('products.*')
        ->distinct('products.id');
        if ($request->has('filter') && $request->has('value')) {
            $filter = $request->input('filter');
            $value = $request->input('value');
            $query->orderBy('products.' . $filter, $value);
        }
        $products = $query->paginate(4);

        return response()->json($products);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function api_products(Request $request){
        $collections = ProductCollection::where('status', 1)
        ->where('highlighted', 1)
        ->with(['products' => function($query) {
            $query->where('products.status', 1)
                  ->where('products.highlighted', 1)
                  ->with('image')
                  ->select('products.*')
                  ->distinct('products.id');
        }])
        ->get();
        return response()->json($collections);
     }
     public function api_single($id){
        $product=Products::where('slug',$id)->first();
        $idProduct=$product->id;
        $storage_img=Gallery::where('model','PRODUCT')->where('image','like','/storage%')->where('id_parent',$idProduct)->select('image')->get();
        foreach ($storage_img as $key => $value) {
            $value->image = url($value->image);
        }
        $images=[];
        $link_img = Gallery::where('model', 'PRODUCT')
        ->where('image', 'not like', '/storage%')
        ->where('id_parent', $idProduct)
        ->select('image')
        ->get();
        $link_img_array = $link_img->toArray();
        $storage_img_array = $storage_img->toArray();
        $images = array_merge($storage_img_array, $link_img_array);
        $links = Links::join('products','links.id_link','=','products.id')
        ->join('gallery','products.id','=','gallery.id_parent')
        ->where('gallery.status',1)
        ->where('links.id_parent',$idProduct)
        ->where('products.status',1)
        ->select('products.name','products.slug','gallery.image','products.price','products.discount','products.compare_price')
        ->get();
        return response()->json(['data'=>[
            'product'=>$product,
            'images'=>$images,
            'links'=>$links
        ]]);
    }
    /**
     * Display the specified resource.
     */
    public function api_load_cart_product(Request $request){
        $validator = Validator::make($request->all(), [
            'cart' => 'required|array',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $arr=[];
        foreach($request->cart as $item){
            // $item=json_decode($item);
            $product=Products::join('gallery','products.id','=','gallery.id_parent')->where('gallery.status',1)->where('products.slug',$item[0])
            ->select('products.id','gallery.image','slug','name','price','compare_price')->get();
            foreach($product as $item1){
                $item2=[
                    'id'=> $item1->id,
                    'name'=>$item1->name,
                    'slug'=>$item1->slug,
                    'quantity'=>$item[1],
                    'discount'=>(int)$item1->price,
                    'price'=>(int)$item1->compare_price,
                    'image'=>$item1->image,
                    'total'=>(int)$item1->price*$item[1],
                ];
               array_push($arr,$item2);
            }
       }
       return response()->json($arr);
    }
      /**
     * Remove the specified resource from storage.
     */
      /**
     * Remove the specified resource from storage.
     */
    public function destroy(Products $products)
    {
        //
    }
}
