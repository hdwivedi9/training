<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeMail;
use App\User;

class UsersController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function register(Request $request){

        $rules = [
            'name'=> 'required|max:200',
            'email'=> 'required|unique:users|regex:/^[a-zA-Z0-9_]+@[a-zA-Z0-9]+\..+$/i',
            'password'=> 'required|regex:/^\S*(?=\S{8,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[0-9])(?=\S*[\W])\S*$/',
        ];
        $message = [
            'password.regex'=>'Please use correct format: one lower case, one upper case, one digit, one special character, atleast 8 characters',
            'unique'=>'This email is already registered',
        ];
        $this->validate($request,$rules,$message);

        $hasher = app()->make('hash');
        $password = $hasher->make($request->password);

        $user = new User;
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = $password;
        $user->save();

        $user->created_by = $user->id;
        //$user->role = 'admin';
        $user->save();

        Mail::to($user->email)->later(1, new WelcomeMail($user));
       // Mail::to($user->email)->send(new WelcomeMail($user));

        $res['success'] = true;
        $res['message'] = 'Registration success!';
        return response($res, 200);

    }
    
    
}
