<?php

namespace App\Http\Controllers\Bills;

use App\Http\Controllers\Controller;
use App\Models\Bills\Bill_Detail;
use App\Models\Bills\Bills;
use App\Models\Carts\Carts;
use App\Models\Products\Products;
use App\Models\Reviews\CanReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use App\Models\Customers\Customers;
use App\Events\PushBills;
use App\Mail\Customer\createUser;
use Illuminate\Support\Facades\Hash;

class BillsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bills = Bills::with(['details.product'])
        ->get()
        ->map(function ($bill) {
            $total = $bill->details->reduce(function ($carry, $detail) {
                $productDiscount = $detail->product->price;
                $quantity = $detail->quantity;
                return $carry + ($productDiscount * $quantity);
            }, 0);
            $bill->total = $total;
            return $bill;
        });
        return Inertia::render("Bills/Index",['bills'=>$bills]);
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
    public function store2(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:255',
            'email' => 'required|email',
            'phone' => 'required',
            'address' => 'required',
            'id_customer'=>'required|exists:customers,id',
        ]);
        if ($validator->fails()) {
            return response()->json(['check'=>false , 'msg' => $validator->errors()->first()], 200);
        }
        $data= [];
        $data['name']=$request->name;
        $data['email']=$request->email;
        $data['phone']=$request->phone;
        $data['address']=$request->address;
        $id_hoa_don = Bills::insertGetId($data);
        $cart= Carts::where('id_customer',$request->id_customer)
        ->select('id_product','quantity')
        ->get();
        foreach ($cart as $key => $value) {
            Bill_Detail::create(['id_hoa_don'=>$id_hoa_don,'id_product'=>$value->id_product,'quantity'=>$value->quantity,'created_at'=>now()]);
            CanReview::create(['id_customer'=> $request->id_customer,'id_product'=>$value->id_product,'created_at'=>now()]);
        }
        Carts::where('id_customer',$request->id_customer)->delete();
        $bills = Bills::with(['details.product'])
        ->get()
        ->map(function ($bill) {
            $total = $bill->details->reduce(function ($carry, $detail) {
                $productDiscount = $detail->product->price;
                $quantity = $detail->quantity;
                return $carry + ($productDiscount * $quantity);
            }, 0);
            $bill->total = $total;
            return $bill;
        });
        broadcast(new PushBills($bills));
        return response()->json(['check'=>true]);
    }
       /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:255',
            'email' => 'required|email',
            'phone' => 'required',
            'address' => 'required',
            'cart'=>'required|array',
        ]);
        if ($validator->fails()) {
            return response()->json(['check'=>false , 'msg' => $validator->errors()->first()], 200);
        }

        $data=[];
        $customer = Customers::where('email',$request->email)->first();
        $password= random_int(1000,9999);
        $newCus['name']=$request->name;
        $newCus['email']=$request->email;
        $newCus['password']=Hash::make($password);
        $newCus['created_at']= now();
        $id_cus=Customers::insertGetId($newCus);
        $dataMail = [
            'name'=>$request->name,
            'email' => $request->email,
            'password' => $password,
        ];
        Mail::to($customer->email)->send(new createUser($dataMail));
        $data['name']=$request->name;
        $data['email']=$request->email;
        $data['phone']=$request->phone;
        $data['address']=$request->address;
        $id_hoa_don = Bills::insertGetId($data);
        foreach ($request->cart as $key => $item) {
            $id_product=Products::where('slug',$item[0])->value('id');
            Bill_Detail::create(['id_hoa_don'=>$id_hoa_don,'id_product'=>$id_product,'quantity'=>$item[1]]);
            CanReview::create(['id_customer'=> $id_cus,'id_product'=>$id_product,'created_at'=>now()]);
        }
        $bills = Bills::with(['details.product'])
        ->get()
        ->map(function ($bill) {
            $total = $bill->details->reduce(function ($carry, $detail) {
                $productDiscount = $detail->product->price;
                $quantity = $detail->quantity;
                return $carry + ($productDiscount * $quantity);
            }, 0);
            $bill->total = $total;
            return $bill;
        });
        broadcast(new PushBills($bills));
        return response()->json(['check'=>true]);
    }

    private function calculateTotal($bill) {
        return $bill->details->reduce(function ($carry, $detail) {
            $productDiscount = $detail->product->price;
            $quantity = $detail->quantity;
            return $carry + ($productDiscount * $quantity);
        }, 0);
    }
        /**
     * Show the form for creating a new resource.
     */
    public function show(Request $request,$id)
    {

        $bill = Bills::with('details.product')->find($id);
        $total = $bill->details->sum(function($detail) {
            return $detail->quantity * $detail->product->price;
        });
       $billList = Bill_Detail::with(['product','product.image'])->where('hoa_don_chi_tiet.id_hoa_don',$id)->select()->get();
       return Inertia::render("Bills/Detail",['total'=>$total,'bill'=>$bill,'billList'=>$billList]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Bills $bills)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Bills $bills,$id)
    {
        $bill= Bills::where('id',$id)->first();
        if(!$bill){
            return response()->json(['check'=>false,'msg'=>'Không tìm thấy mã hóa đơn']);
        }
        $data=$request->all();
        $data['updated_at']=now();
        Bills::where('id',$id)->update($data);
        $bill = Bills::with('details.product')->find($id);
        $total = $bill->details->sum(function($detail) {
            return $detail->quantity * $detail->product->price;
        });
       $billList = Bill_Detail::with(['product','product.image'])->where('hoa_don_chi_tiet.id_hoa_don',$id)->select()->get();
        return response()->json(['check'=>true,'bill'=>$bill,'total'=>$total,'billList'=>$billList]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bills $bills)
    {
        //
    }
}
