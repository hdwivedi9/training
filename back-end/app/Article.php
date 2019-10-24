<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Search\Searchable;

class Article extends Model
{		
		use Searchable;
    protected $casts = [
        'tags' => 'json',
    ];
}
