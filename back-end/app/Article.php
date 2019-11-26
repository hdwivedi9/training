<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Searchable;

class Article extends Model
{		
	use Searchable;
  protected $casts = [
    'tags' => 'json',
  ];

  public function ratings()
  {
    return $this->hasMany('App\Rating')->select(array('id', 'article_id', 'rating', 'given_by'));
  }
}
