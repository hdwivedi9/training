<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Exception;
use Firebase\JWT\ExpiredException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Mail;
use App\Mail\ForgetMail;
use App\users;

class ForgetController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */

    protected function jwt(users $users) {
         $payload = [
            'iss' => "lumen-jwt",
            'sub' => $users->id,
            'type'=>"forget",
            'iat' => time(),
            'exp' => time() + 3*60
        ];
        
        return JWT::encode($payload, env('JWT_SECRET'));
    }

    public function __construct()
    {
        //
    }

    public function forget(Request $request){
        
        $rules = [
            'email'=> 'required|regex:/^[a-zA-Z0-9_]+@[a-zA-Z0-9]+\..+$/i|exists:users,email,deleted_at,NULL',
        ];
        $this->validate($request,$rules);

        $email = $request->email;
        $user = users::where('email', $email)->first();


        $res['success'] = true;
        $res['message'] = 'Redirect to /forget/new_pass';
        //$res['data'] =  ['token' => $this->jwt($user)];
        $token = $this->jwt($user);

        Mail::to($user->email)->later(1, new ForgetMail($token, $user->name));
        return response($res, 200);

        // $res['success'] = false;
        // $res['message'] = 'email not found';
        // return response($res, 404);
    }

    public function new_pass(Request $request){

        $token = $request->header('Authorization');
        
        if(!$token) {

            $res['error']='Token required';
            return response($res,401);
        }
          
        try{
            $credentials = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        } catch(ExpiredException $e){
            $res['error'] = 'Provided token is expired';
            return response($res,400);
        } catch(Exception $e){
            $res['error'] = 'Error while decoding token';
            return response($res,400);
        }
      
        $user = users::find($credentials->sub);
      
        if(empty($user) || $credentials->type !== "forget"){
          
            $res['error']='Provided token is invalid';
            return response($res,400);
        }

        $rules = [
            'newpassword'=> 'required|regex:/^\S*(?=\S{8,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[0-9])(?=\S*[\W])\S*$/',
            'repassword'=> 'required|same:newpassword'
        ];
        $message = [
            'regex'=>'Please use correct format: one lower case, one upper case, one digit, one special character, atleast 8 characters',
            'same'=>'Passwords do not match'
        ];
        $this->validate($request,$rules,$message);

        $newpassword=$request->newpassword;
        $repassword=$request->repassword;

        $hasher = app()->make('hash');
        $newpassword = $hasher->make($newpassword);
        $user->password = $newpassword;
        $user->save();

        $res['success']=true;
        $res['message']='Password Updated Successfully';
        return response($res,200);
    }
}
