<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class tasks extends Model
{
    //use SoftDeletes;

     // protected $fillable = [
     //     'title', 'desc'
     // ];
 
    // protected $hidden = [
    //     'password', 'deleted_by', 'deleted_at'
    // ];

    public function create()
    {
        return $this->belongsTo('App\users', 'creator');
    }

    public function assign()
    {
        return $this->belongsTo('App\users', 'assignee');
    }

	public $timestamps = false;
}
