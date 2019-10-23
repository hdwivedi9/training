<?php

use App\users;
/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

//$router->get('/', function () use ($router) {
//    $count = users::query()->get()->count();
//    return $count;
//});

$router->group(['middleware' => 'jwt.auth'], function() use ($router) {
        $router->get('/login/get_user', 'LoginController@get_user');
        $router->post('/login/delete', 'LoginController@delete');
        $router->post('/login/role_change', 'LoginController@role_change');
        $router->post('/login/create_user', 'LoginController@create_user');
        $router->post('/task/newTask', 'TaskController@newTask');
        $router->post('/task/updateTask', 'TaskController@updateTask');
        $router->post('/task/deleteTask', 'TaskController@deleteTask');
        $router->post('/task/taskStatus', 'TaskController@taskStatus');
        $router->get('/task/taskList', 'TaskController@taskList');
        $router->get('/task', 'TaskController@highchart');
    }
);


$router->post('/register', 'UsersController@register');
$router->post('/login', 'LoginController@login');
$router->post('/forget', 'ForgetController@forget');
$router->post('/forget/new_pass', ['as'=> 'new_pass', 'uses'=>'ForgetController@new_pass']);

$router->get('/sendMail', 'MailController@sendMail');
$router->get('/sendMail/queue', 'MailController@queueMail');
