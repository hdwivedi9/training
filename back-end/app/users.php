<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class users extends Model
{
    use SoftDeletes;

     protected $fillable = [
         'name', 'email', 'password'
     ];
 
    protected $hidden = [
        'password', 'deleted_by', 'deleted_at'
    ];

    // public function creator()
    // {
    //     return $this->hasMany('App\tasks', 'creator');
    // }

    // public function assignee()
    // {
    //     return $this->hasMany('App\tasks', 'assignee');
    // }
}
