<?php

namespace App\Http\Controllers\Comments;

use App\Http\Controllers\Controller;
use App\Models\Comments\Comments;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use App\Models\Customers\Customers;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $comments = Comments::with(['customer', 'products'])->get();
        return Inertia::render('Comments/Index', ['comments' => $comments]);
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
            'email' => 'required|exists:customers,email',
            'id_product' => 'required|exists:products,id',
            'comment' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $email = $request->email;
        $id_cus = Customers::where('email', $email)->value('id');
        $data['comment'] = $request->comment;
        $data['id_customer'] = $id_cus;
        $data['id_product'] = $request->id_product;
        $data['created_at'] = now();
        Comments::create($data);
        return response()->json(['check' => true]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Comments $comments)
    {
        //
    }
    public function getProductComment($id)
    {
        $comments = Comments::where('status', 1)
            ->whereHas('products', function ($query) use ($id) {
                $query->where('slug', $id);
            })
            ->with(['customer', 'products'])
            ->get();
        return response()->json($comments);
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Comments $comments)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Comments $comments, $id)
    {
        $comment = Comments::where('id', $id)->first();
        if (!$comment) {
            return response()->json(['check' => false, 'msg' => 'Không tìm thấy mã comment']);
        }
        $data = $request->all();
        $data['updated_at'] = now();
        Comments::where('id', $id)->update($data);
        $comments = Comments::with(['customer', 'products'])->get();
        return response()->json(['check' => true, 'data' => $comments]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comments $comments)
    {
        //
    }
}
