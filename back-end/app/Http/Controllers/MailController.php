<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeMail;

class MailController extends Controller
{
    public function sendMail(){

    	Mail::to('himdwi9@gmail.com')->send(new WelcomeMail());
    }

    public function queueMail(){

    	Mail::to('himdwi9@gmail.com')
    		->later(60, new WelcomeMail());

    	return 'Email in 60 sec';
    }
}
