<?php

namespace App\Repositories\Interfaces;

use Illuminate\Database\Eloquent\Collection;
use App\Article;

interface ArticleInterface
{
    public function search(string $query = ''): Collection;
    public function newArticle(Article $article);
    public function groupByTags(): array;
}