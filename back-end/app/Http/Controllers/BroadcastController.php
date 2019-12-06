<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;


class BroadcastController extends Controller {

    private $key;
    private $secret;

    public function __construct()
    {
    	$this->key = env('PUSHER_APP_KEY', null);
    	$this->secret = env('PUSHER_APP_SECRET', null);
    }

    private function authPrivate($socket, $channel)
    {
    	$hash = hash_hmac('sha256', $socket.':'.$channel, $this->secret);
    	return response()->json(['auth' => $this->key.':'.$hash], 200);
    }

    private function authPresence($socket, $channel, $user)
    {
    	$data = [
    		'user_id' => $user->id,
    		'user_info' => [
    			'name' => $user->name,
    			'email' => $user->email,
    		]
    	];
    	$json_data = json_encode($data);
    	$hash = hash_hmac('sha256', $socket.':'.$channel.':'.$json_data, $this->secret);
    	return response()->json(['auth' => $this->key.':'.$hash, 'channel_data' => $json_data], 200);
    }

    private function authChannel($type, $socket, $channel, $user)
    {
    	if($type === 'private'){
    		return $this->authPrivate($socket, $channel);
    	}
    	if($type === 'presence'){
    		if($user->role === 'admin')
    			return $this->authPresence($socket, $channel, $user);
    	}
    	return response('Channel not authorized', 403);
    }

    public function authenticate(Request $request)
    {
    	$user = $request->auth;
    	$socket = $request->socket_id;
    	$channel = $request->channel_name;

    	$type = 'public';
    	if(!strncmp($channel, 'private-', 8))
    		$type = 'private';
    	else if(!strncmp($channel, 'presence-', 9))
    		$type = 'presence';

    	return $this->authChannel($type, $socket, $channel, $user);
    }
}