<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('article', function ($user, $userId) {
    //return $user->id === $userId;
    return true;
});