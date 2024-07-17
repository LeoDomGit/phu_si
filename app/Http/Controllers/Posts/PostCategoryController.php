<?php

namespace App\Http\Controllers\Posts;

use App\Models\Post\PostsCategory;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class PostCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = PostsCategory::all();
        return Inertia::render('Post/PostCategory', ['categories' => $categories]);
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
            'title' => 'required|unique:post_categories,title|max:255|min:3|string',
            'summary' => 'required|max:255|min:10|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }

        $data = $request->all();
        $data['slug'] = Str::slug($request->title);
        $data['status'] = 1;
        $data['created_at'] = now();
        $data['updated_at'] = now();
        $created = PostsCategory::create($data);

        if ($created) {
            $categories = PostsCategory::all();
            return response()->json(['check' => true, 'msg' => 'Tạo mới thành công', 'data' => $categories]);
        } else {
            return response()->json(['check' => false, 'msg' => 'Tạo không thành công']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
            'title' => 'unique:post_categories,title,max:255|min:3|string',
            'summary' => 'max:255|min:10|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }

        $data = $request->all();
        $request->has('title') ? $data['slug'] = Str::slug($request->title) : '';
        $data['updated_at'] = now();
        $updated = PostsCategory::find($id)->update($data);

        if ($updated) {
            $categories = PostsCategory::all();
            return response()->json(['check' => true, 'msg' => 'Cập nhật thành công', 'data' => $categories]);
        } else {
            return response()->json(['check' => false, 'msg' => 'Cập nhật thất bại']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = PostsCategory::find($id);
        $deleted = $category->delete();

        if ($deleted) {
            $categories = PostsCategory::all();
            return response()->json(['check' => true, 'msg' => 'Xóa thanh cong', 'data' => $categories]);
        } else {
            return response()->json(['check' => false, 'msg' => 'Xóa thất bại']);
        }
    }
}
