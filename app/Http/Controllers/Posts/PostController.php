<?php

namespace App\Http\Controllers\Posts;

use Inertia\Inertia;
use App\Models\Links;
use App\Models\Post\Posts;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Products\Products;
use App\Models\Post\PostsCategory;
use App\Http\Controllers\Controller;
use App\Models\Post\PostCollections;
use Illuminate\Support\Facades\Validator;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Posts::with('category')->get();
        $products = Products::select('id', 'name')->get();
        $categorys = PostsCategory::where('status', 1)->get();
        $collection = PostCollections::where('status', 1)->get();
        return Inertia::render('Post/Post', ['posts' => $posts, 'categorys' => $categorys, 'collections' => $collection, 'products' => $products]);
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
            'title' => 'required',
            'summary' => 'required',
            'id_collection' => 'required',
            'id_category' => 'required',
            'position' => 'required',
            'content' => 'required',
            'image' => 'required',
            'status' => 'boolean',
            'highlighted' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }

        $data = $request->all();
        if ($data['collection']) {
            unset($data['collection']);
        }
        $data['slug'] = Str::slug($request->title);
        $data['view'] = 0;
        $data['created_at'] = now();
        $data['updated_at'] = now();
        try {
            $created = Posts::create($data);
            if ($created) {
                if ($request->has('collection')) {
                    $collection = json_decode($request->collection);
                    Links::where('id_link', $created->id)->delete();
                    foreach ($collection as $key => $value) {
                        Links::create(['id_link' => $created->id, 'model1' => 'POST', 'model2' => 'PRODUCT', 'id_parent' => $value, 'created_at' => now()]);
                    }
                }
                $posts = Posts::with('category')->get();
                return response()->json(['check' => true, 'msg' => 'Tạo bài viết thành công', 'data' => $posts]);
            } else {
                return response()->json(['check' => false, 'msg' => 'Tạo bài viết thất bại']);
            }
        } catch (\Exception $e) {
            return response()->json(['check' => false, 'msg' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = Posts::with('category')->findOrFail($id);
        $links = Links::where('id_link', $id)->pluck('id_parent');
        return response()->json(['check' => true, 'links' => $links, 'data' => $data]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'min:3|string|max:255|unique:posts,title',
            'summary' => 'min:10|string|max:255',
            // 'id_collection' => 'required',
            'id_category' => 'exists:post_categories,id|numeric',
            'position' => 'min:0|numeric|max:255',
            'content' => 'min:10|string|nullable',
            'status' => 'boolean|in:0,1',
            'highlighted' => 'boolean|in:0,1',
        ]);

        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }

        $data = $request->all();
        $request->has('title') ? $data['slug'] = Str::slug($request->title) : '';
        $data['updated_at'] = now();
        try {
            $updated = Posts::findOrFail($id)->update($data);
            if ($request->has('collection')) {
                $collection = json_decode($request->collection);
                Links::where('id_link', $id)->delete();
                foreach ($collection as $key => $value) {
                    Links::create(['id_link' => $id, 'model1' => 'POST', 'model2' => 'PRODUCT', 'id_parent' => $value, 'created_at' => now()]);
                }
            }
            if ($updated) {

                $posts = Posts::with('category')->get();
                return response()->json(['check' => true, 'msg' => 'Cập nhật bài viết thành công', 'data' => $posts]);
            } else {
                return response()->json(['check' => false, 'msg' => 'Cập nhật thất bại']);
            }
        } catch (\Exception $e) {
            return response()->json(['check' => false, 'msg' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $deleted = Posts::findOrFail($id)->delete();
        if ($deleted) {
            $posts = Posts::with('category')->get();
            return response()->json(['check' => true, 'msg' => 'Xóa thanh công', 'data' => $posts]);
        } else {
            return response()->json(['check' => false, 'msg' => 'Xóa thất bại']);
        }
    }
    // =========================================
    public function api_post()
    {
        $posts = Posts::where('status', 1)->orderBy('position', 'asc')->get();
        $new_posts = Posts::where('status', 1)->orderBy('id', 'desc')->take(4)->get();
        $postcates = PostsCategory::where('status', 1)->select('id', 'slug', 'title')->get();
        return response()->json(['posts' => $posts, 'new_posts' => $new_posts, 'postcates' => $postcates]);
    }
    // =========================================
    public function api_highlight()
    {
        $posts = Posts::with('category')->where('status', 1)->where('highlighted', 1)->orderBy('position', 'asc')->get();
        return response()->json($posts);
    }

    // =========================================

    public function single_post($id)
    {
        $posts = Posts::where('status', 1)->where('slug', $id)->first();
        $postcates = PostsCategory::where('status', 1)->select('id', 'slug', 'title')->get();
        $products = Links::join('products', 'links.id_parent', '=', 'products.id')
            ->join('gallery', 'products.id', '=', 'gallery.id_parent')
            ->where('gallery.status', 1)
            ->where('links.id_link', $posts->id)
            ->where('products.status', 1)
            ->select('products.name', 'products.slug', 'gallery.image', 'products.price', 'products.discount', 'products.compare_price')
            ->get();
        $new_posts = Posts::where('status', 1)->orderBy('id', 'desc')->take(4)->get();
        return response()->json(['post' => $posts, 'products' => $products, 'newposts' => $new_posts, 'postcates' => $postcates]);
    }
}
