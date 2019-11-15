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

    public function ratings()
    {
        return $this->hasMany('App\Rating', 'given_by');
    }
}
