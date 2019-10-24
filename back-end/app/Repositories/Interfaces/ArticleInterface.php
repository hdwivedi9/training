<?php

namespace App\Repositories\Interfaces;

use Illuminate\Database\Eloquent\Collection;

interface ArticleInterface
{
    public function search(string $query = ''): Collection;
}