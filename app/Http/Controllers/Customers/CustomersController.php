<?php

namespace App\Http\Controllers\Customers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CustomerRequest;
use App\Mail\Customer\createUser;
use App\Models\Bills\Bills;
use App\Models\Customers\Customers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Pagination\LengthAwarePaginator;
class CustomersController extends Controller
{
     /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
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
    public function get_bills(Request $request)
    {

        $bills = Bills::with(['details.product'])
            ->where('email', Auth::user()->email)
            ->paginate(3);

        $bills->getCollection()->transform(function ($bill) {
            $bill->total = $this->calculateTotal($bill);
            return $bill;
        });

        return response()->json($bills);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CustomerRequest $request)
    {
        $request->validated();
        $data['name']=$request->name;
        $data['email']=$request->email;
        $data['password']=Hash::make($request->password);
        Customers::create($data);
        return response()->json(['check'=>true]);
    }

    // ==============================
    public function CheckLogin(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:customers,email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }

        if (Auth::guard('customer')->attempt(['email' => $request->email, 'password' => $request->password,'status'=>1], true)) {
            $customer = Auth::guard('customer')->user();
            $customer->tokens()->delete();
            $token = $customer->createToken('CustomerToken')->plainTextToken;
            return response()->json([
                'check' => true,
                'id'=>$customer->id,
                'token' => $token,
            ]);
        }else{
            return response()->json(['check'=>false,'msg'=>'Sai tên đăng nhập hoặc mật khẩu']);
        }
    }
     // ==============================
     public function CheckLoginSocial(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:customers,email',
        ]);

        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $user=Customers::where('email',$request->email)->first();
        if ($user) {
            $user->tokens()->delete();
            $token = $user->createToken('CustomerToken')->plainTextToken;

            return response()->json([
                'check' => true,
                'id' => $user->id,
                'token' => $token,
            ]);
        } else {
            return response()->json(['check' => false, 'message' => 'Không tìm thấy email'], 200);
        }
    }
    /**
     * Display the specified resource.
     */
    public function show(Customers $customers)
    {
        $customers=Customers::where('id',Auth::id())->first();
        return response()->json(['name'=>$customers->name,'email'=>$customers->email,'phone'=>$customers->phone,'address'=>$customers->address,'verified'=>$customers->email_verified_at]);

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customers $customers)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Customers $customers,$id)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'email|unique:customers,email',
            'name' => 'unique:customers,name',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $customer= Customers::where('status',1)->where('id',$id)->first();
        if(!$customer){
            return response()->json(['check'=>false,'msg'=>'Tài khoản không tồn tại']);
        }
        $data= $request->all();
        if($request->has('email')){
            $data['email_verified_at']=null;
        }
        if($request->has('password') && $data['password']){
            $data['password']=Hash::make($data['password']);
        }
        $data['updated_at']= now();
        Customers::where('id',$id)->update($data);
        $customers=Customers::where('id',Auth::id())->first();
        return response()->json(['check'=>true,'data'=>$customers]);
    }
    /**
     * Update the specified resource in storage.
     */
    public function resetPassword (Request $request,Customers $customers)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:customers,email',
        ],[
            'email.required'=>'Chưa nhận được email',
            'email.email'=>'Email không hợp lệ',
            'email.exists'=>'Email không tồn tại',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $customer = Customers::where('email',$request->email)->first();
        $password= random_int(1000,9999);
        $customer->update(['password'=>Hash::make($password)]);
        $data = [
            'email' => $customer->email,
            'password' => $password,
        ];
        Mail::to($customer->email)->send(new createUser($data));
        return response()->json(['check'=>true]);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customers $customers)
    {
        //
    }
}
