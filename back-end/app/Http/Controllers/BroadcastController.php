<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;


class BroadcastController extends Controller {

    public function authenticate(Request $request)
    {
    	$key = env('PUSHER_APP_KEY', null);
    	$secret = env('PUSHER_APP_SECRET', null);

    	$socket = $request->socket_id;
    	$channel = $request->channel_name;

    	$hash = hash_hmac('sha256', $socket.':'.$channel, $secret);

    	return response()->json(['auth' => $key.':'.$hash], 200);
    }
}