<?php

namespace App\Repositories;

use App\Article;
use Illuminate\Database\Eloquent\Collection;
use App\Repositories\Interfaces\ArticleInterface;

class ArticleRepository implements ArticleInterface
{
    public function search(string $query = ''): Collection
    {
        return Article::query()
            ->where('body', 'like', "%{$query}%")
            ->orWhere('title', 'like', "%{$query}%")
            ->get();
    }
}