<?php
namespace App\Http\Middleware;
use Closure;
use Exception;
use App\User;
use Firebase\JWT\JWT;
use Firebase\JWT\ExpiredException;

class ArticleMiddleware
{
    public function handle($request, Closure $next, $guard = null)
    {
        $token = $request->cookie('token');

        if(!$token) {
            $request->auth = null;
            return $next($request);
        }
          
        try{
            $credentials = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        } catch(ExpiredException $e){
            $request->auth = null;
            return $next($request);
        } catch(Exception $e){
            $request->auth = null;
            return $next($request);
        }
      
        $user = User::find($credentials->sub);
      
        if(!empty($user) && $credentials->type === "user"){
          
            $request->auth = $user;
          
        }else{
            $request->auth = null;
        }
        
        return $next($request);
    }
}