<?php

namespace App\Http\Controllers\Posts;

use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Post\PostCollections;
use Illuminate\Support\Facades\Validator;

class PostCollectionsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = PostCollections::all();
        return Inertia::render('Post/PostCollections', ['collections' => $data]);
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
            'name' => 'required|unique:post_collections,name',
            'position' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }

        $data = $request->all();
        $data['slug'] = Str::slug($data['name']);
        $data['created_at'] = now();
        $data['updated_at'] = now();
        $created = PostCollections::create($data);

        if ($created) {
            $collections = PostCollections::all();
            return response()->json(['check' => true, 'msg' => 'Tạo thành công', 'data' => $collections]);
        } else {
            return response()->json(['check' => false, 'msg' => 'Tạo thấtt bại']);
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
            'name' => 'unique:post_collections,name',
            'position' => 'numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }

        $data = $request->all();
        ($request->has('name')) ? $data['slug'] = Str::slug($request->name) : '';
        $data['updated_at'] = now();
        $updated = PostCollections::find($id)->update($data);

        if ($updated) {
            $collections = PostCollections::all();
            return response()->json(['check' => true, 'msg' => 'Cập nhật thành công', 'data' => $collections]);
        } else {
            return response()->json(['check' => false, 'msg' => 'Cập nhật thất bại']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $collections = PostCollections::find($id);
        if (!$collections) {
            return response()->json(['check' => false, 'msg' => 'Không tìm thấy collection']);
        }
        $deleted = $collections->delete();

        if ($deleted) {
            $collections = PostCollections::all();
            return response()->json(['check' => true, 'msg' => 'Xóa thành công', 'data' => $collections]);
        } else {
            return response()->json(['check' => false, 'msg' => 'Xóa thất bại']);
        }
    }
}
