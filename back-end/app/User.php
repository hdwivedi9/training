<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class User extends Model
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
        return $this->hasMany('App\Rating', 'given_by')->select(array('id', 'article_id', 'rating', 'given_by'));
    }
}

