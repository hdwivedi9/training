<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{

    public function create()
    {
        return $this->belongsTo('App\User', 'creator');
    }

    public function assign()
    {
        return $this->belongsTo('App\User', 'assignee');
    }

	public $timestamps = false;
}
