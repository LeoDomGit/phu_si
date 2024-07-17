<?php

namespace App\Http\Controllers\Reviews;

use App\Http\Controllers\Controller;
use App\Models\Customers\Customers;
use App\Models\Reviews\Reviews;
use Illuminate\Http\Request;
use App\Models\Reviews\CanReview;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use App\Models\Products\Products;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function index(){
        $reviews = Reviews::with(['products','customer'])
        ->get();
        return Inertia::render('Reviews/Index',['reviews'=>$reviews]);
    }
    /**
     * Display a listing of the resource.
     */
    public function can_review(Request $request)
    {
        $customer = Customers::find(Auth::user()->id);
        $canReviewProducts = $customer->canReviewProducts()
        ->with(['image' => function($query) {
            $query->where('status', 1);
        }])
        ->where('status', 1)
        ->get();
        return response()->json($canReviewProducts);
        
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
            'id_product' => 'required|exists:products,id',
            'star' => 'required',
            'review' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['check'=>false , 'msg' => $validator->errors()->first()], 200);
        }
        $id_customer = Auth::user()->id;
        $data=$request->all();
        $data['id_customer']=$id_customer;
        $data['created_at']=now();
        Reviews::create($data);
        CanReview::where('id_customer',$id_customer)->where('id_product',$request->id_product)->delete();
        return response()->json(['check'=>true]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Reviews $reviews)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reviews $reviews)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reviews $reviews, $id)
    {
        $data=$request->all();
        $review = Reviews::find($id);
        if(!$review){
            return response()->json(['check'=>false,'msg'=>'Không tìm thấy mã']);
        }
        $data['updated_at']=now();
        Reviews::where('id',$id)->update($data);
        $reviews = Reviews::with(['products','customer'])
        ->get();
        return response()->json(['check'=>true,'data'=>$reviews]);
    }
 // ================================================
    public function getProductReviews($id)
    {
        $comments = Reviews::where('status', 1)
            ->whereHas('product', function ($query) use ($id) {
                $query->where('id', $id);
            })
            ->with(['customer', 'product'])
            ->get();
        return response()->json($comments);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reviews $reviews)
    {
        //
    }
}
