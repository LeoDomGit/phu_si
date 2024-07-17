<?php

namespace App\Http\Controllers\Slide;

use Inertia\Inertia;
use App\Models\Slide\Slide;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use League\CommonMark\Extension\CommonMark\Node\Inline\Strong;

class SlidesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Slide::all();
        return Inertia::render('Slides/Slides', ['slides' => $data]);
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
            'desktop' => 'image|file|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'mobile' => 'image|file|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'url' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }

        if ($request->hasFile('desktop') && $request->hasFile('mobile')) {
            $desktop = $request->file('desktop');
            $mobile = $request->file('mobile');
            $file_desktop = $desktop->getClientOriginalName();
            $file_mobile = $mobile->getClientOriginalName();
            $desktop->storeAs('/public/images/slides/desktop', $file_desktop);
            $mobile->storeAs('/public/images/slides/mobile', $file_mobile);
        }

        $data = [
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'url' => $request->url,
            'path' => "/images/slides/",
            'desktop' => $file_desktop,
            'mobile' => $file_mobile,
            'status' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ];

        $created = Slide::create($data);

        if ($created) {
            $data = Slide::all();
            return response()->json(['check' => true, 'msg' => 'Thêm slide thành công', 'data' => $data]);
        } else {
            return response()->json(['check' => false, 'msg' => 'Thêm slide thất bại']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = Slide::findOrFail($id);
        return response()->json(['check' => true, 'data' => $data]);
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
            'name' => 'string|max:255|unique:slides,name',
            'desktop' => 'image|file|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'mobile' => 'image|file|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'url' => 'nullable|url',
            'status' => 'boolean|in:0,1',
        ]);

        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }

        $data = $request->all();

        if ($request->has('name')) {
            $data['slug'] = Str::slug($request->name);
        }

        $item = Slide::findOrFail($id)->update($data);
        if ($item) {
            $data = Slide::all();
            return response()->json(['check' => true, 'msg' => 'Cập nhật thành công', 'data' => $data]);
        } else {
            return response()->json(['check' => false, 'msg' => 'Cập nhật thất bại']);
        }
    }

    public function changeImage(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'desktop' => 'image|file|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'mobile' => 'image|file|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }

        $data = $request->all();
        $item = Slide::findOrFail($id);

        // dd($data);

        if ($request->hasFile('desktop')) {

            if ($item->desktop && Storage::exists('public/images/slides/desktop/' . $item->desktop)) {
                Storage::delete('public/images/slides/desktop/' . $item->desktop);
            }
            $desktop = $request->file('desktop');
            $file_desktop = $desktop->getClientOriginalName();
            $desktop->storeAs('/public/images/slides/desktop', $file_desktop);
            $data['desktop'] = $file_desktop;
        }

        if ($request->hasFile('mobile')) {
            if ($item->mobile && Storage::exists('public/images/slides/mobile/' . $item->mobile)) {
                Storage::delete('public/images/slides/mobile/' . $item->mobile);
            }
            $mobile = $request->file('mobile');
            $file_mobile = $mobile->getClientOriginalName();
            $mobile->storeAs('/public/images/slides/mobile', $file_mobile);
            $data['mobile'] = $file_mobile;
        }

        $update = $item->update($data);

        if ($update) {
            $data = Slide::all();
            return response()->json(['check' => true, 'msg' => 'Cập nhật thành công', 'data' => $data]);
        } else {
            return response()->json(['check' => false, 'msg' => 'Cập nhật thất bại']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $item = Slide::findOrFail($id);

        if ($item->desktop && Storage::exists('public/images/slides/desktop/' . $item->desktop)) {
            Storage::delete('public/images/slides/desktop/' . $item->desktop);
        }

        if ($item->mobile && Storage::exists('public/images/slides/mobile/' . $item->mobile)) {
            Storage::delete('public/images/slides/mobile/' . $item->mobile);
        }

        if ($item) {
            $item->delete();
            $data = Slide::all();
            return response()->json(['check' => true, 'msg' => 'Xóa slide thành công', 'data' => $data]);
        } else {
            return response()->json(['check' => false, 'msg' => 'Xóa slide thất bại']);
        }
    }
    // =================================================
    public function api_slides($id){
        $slides= Slide::where('status',1)
        ->where('slug','like','%'.$id.'%')
        ->select('path','desktop','mobile')
        ->get();
        return response()->json($slides);
    }
}
