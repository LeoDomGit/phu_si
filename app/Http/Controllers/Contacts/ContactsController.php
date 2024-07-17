<?php

namespace App\Http\Controllers\Contacts;

use App\Http\Controllers\Controller;
use App\Models\Contacts\Contacts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
class ContactsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contact=Contacts::all();
        return Inertia::render('Contacts/Index',['contacts'=>$contact]);
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
         'name'=>'required',
         'email'=>'required|email',
         'phone'=>'required|min:10|max:10',
         'message'=>'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $data=$request->all();
        $data['created_at']=now();
        Contacts::create($data);
        return response()->json(['check'=>true]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Contacts $contacts)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Contacts $contacts)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Contacts $contacts,$id)
    {
        $data=$request->all();
        $data['updated_at']=now();
        Contacts::where('id',$id)->update($data);
        $contacts=Contacts::all();
        return response()->json(['check'=>true,'data'=>$contacts]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contacts $contacts)
    {
        //
    }
}
