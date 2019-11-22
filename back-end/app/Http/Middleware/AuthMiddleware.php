<?php
namespace App\Http\Middleware;
use Closure;
use Exception;
use App\User;
use Firebase\JWT\JWT;
use Firebase\JWT\ExpiredException;

class AuthMiddleware
{
    public function handle($request, Closure $next, $guard = null)
    {
        //$token = $request->header('Authorization');
        $token = $request->cookie('token');

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
      
        $user = User::find($credentials->sub);
      
        if(!empty($user) && $credentials->type === "user"){
          
            $request->auth = $user;
          
        }else{
          
            $res['error']='Provided token is invalid';
            return response($res,400);
        }
        
        return $next($request);
    }
}