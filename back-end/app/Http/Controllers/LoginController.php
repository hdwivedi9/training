<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Exception;
use Firebase\JWT\ExpiredException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Cookie;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeMail;
use App\User;

class LoginController extends Controller
{
    protected function jwt(User $user) {
         $payload = [
            'iss' => "lumen-jwt",
            'sub' => $user->id,
            'role'=> $user->role,
            'name'=> $user->name,
            'type'=>"user",
            'iat' => time(),
            'exp' => time() + 3*60*60
        ];
        
        return JWT::encode($payload, env('JWT_SECRET'));
    }

    public function __construct()
    {
        //
    }

    public function login(Request $request){
        
        $rules = [
            'email'=> 'required|max:500|regex:/^[a-zA-Z0-9_]+@[a-zA-Z0-9]+\..+$/i|exists:users,email,deleted_at,NULL',
            'password'=> 'required',
        ];

        $this->validate($request,$rules);

        $email = $request->email;
        $user = User::where('email', $email)->first();

        if(Hash::check($request->password, $user->password)){
            $res['success'] = true;
            $res['message']='Login Successfull';
            //$res['data'] =  ['token' => $this->jwt($user)];

            return response($res,200)->withCookie(new Cookie('token', $this->jwt($user), time()+(3*60*60), '/', null, false, false));
        }

        $res['success'] = false;
        $res['message'] = 'Invalid Credentials';
        return response($res, 404);
    }


    public function delete(Request $request){

        $user = $request->auth;

        if($user->role!=='admin'){
            $res['error']='Unauthorized User';
            return response($res,401);
        }

        $rules = [
        'id'=> 'required|integer|exists:users,id,deleted_at,NULL',
        ];

        $this->validate($request,$rules);

        $id=$request->id;
        $user_del = User::find($id);
        
        $user_del->deleted_by=$user->id;
        $user_del->save();
        $user_del->delete();

        $res['success']=true;
        $res['message']='User is deleted';
        return response($res,200);

    }

    public function role_change(Request $request){

        $user = $request->auth;

        if($user->role!=='admin'){
            $res['error']='Unauthorized User';
            return response($res,401);
        }

        $rules = [
        'id'=> 'required|integer|exists:users,id,deleted_at,NULL',
        'role'=> 'required|in:admin,normal',
        ];

        $this->validate($request,$rules);

        $id=$request->id;
        $role = $request->role;
        $user_role = User::find($id);

        $user_role->role=$role;
        $user_role->save();

        $res['success']=true;
        $res['message']='User role is changed successfully';
        return response($res,200);

    }


    public function create_user(Request $request){

        if($request->auth->role!=='admin'){
            $res['error']='Unauthorized User';
            return response($res,401);
        }

        $rules = [
            'name'=> 'required|max:200',
            'email'=> 'required|unique:users|regex:/^[a-zA-Z0-9_]+@[a-zA-Z0-9]+\..+$/i',
            'password'=> 'required|regex:/^\S*(?=\S{8,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[0-9])(?=\S*[\W])\S*$/',
            'role'=> 'required|in:admin,normal',
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
        $user->role = $request->role;
        $user->created_by = $request->auth->id;
        $user->save();


        $res['success'] = true;
        $res['message'] = 'User created successfully!';

        Mail::to($user->email)->later(1, new WelcomeMail($user));

        return response($res, 200);

    }


    public function get_user(Request $request){

        $user = $request->auth;

        $rules = [

        'name'=> 'max:200|nullable',
        'email'=> 'nullable',
        'role'=> 'nullable',
        'createdBy'=> 'max:200|nullable',
        'deletedBy'=> 'max:200|nullable',
        'created_at'=> 'date|nullable',
        'updated_at'=> 'date|nullable',

        // 'limit'=> 'integer|nullable',
        // 'offset'=> 'integer|nullable',
        ];

        $message = [
            'date'=> 'Please enter the date in YYYY-MM-DD format',

        ];
        $this->validate($request,$rules,$message);

        $name = $request->name;
        $email = $request->email;
        $role = $request->role;
        $createdBy = $request->createdBy;
        $deletedBy = $request->deletedBy;
        $created_at = $request->created_at;
        $updated_at = $request->updated_at;

        // $limit = $request->limit;
        // $offset = $request->offset;

        // if(empty($offset)){
        //     $offset=0;
        // }
        // if(empty($limit)){
        //     $limit=10;
        // }
        // else if($limit >100){
        //     $limit=100;
        // }

        $list = db::table('users')
            ->leftJoin('users as u', 'users.created_by', '=', 'u.id')
            ->leftJoin('users as v', 'users.deleted_by', '=', 'v.id')
            ->select('users.id', 'users.name', 'users.email', 'users.role', 'users.created_at', 'users.updated_at', 'u.name as created_by', 'v.name as deleted_by')
            ->where(function($query) use ($user, $name,$email,$role,$created_at, $updated_at, $createdBy, $deletedBy){
                $query->where('users.deleted_by', '=', null);
                if(!is_null($name)) $query->where('users.name', 'LIKE','%'.$name.'%');
                if(!is_null($email)) $query->where('users.email', 'LIKE','%'.$email.'%');
                if(!is_null($role)) $query->where('users.role', 'LIKE','%'.$role.'%');
                if(!is_null($created_at)) $query->where('users.created_at','>=',$created_at);
                if(!is_null($updated_at)) $query->where('users.updated_at','>=',$updated_at);
                if(!is_null($createdBy)) $query->where('u.name','LIKE','%'.$createdBy.'%');
                if(!is_null($deletedBy)) $query->where('v.name','LIKE','%'.$deletedBy.'%');

            })->orderby('id')->get();



        $res['data']=$list;
        return response($res,200);
        
    }
    
    
}
