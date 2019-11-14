<?php

namespace App\Repositories\Interfaces;

use App\Article;

interface ArticleInterface
{
    public function search(string $query = ''): array;
    public function newArticle(Article $article);
    public function groupByTags(): array;
}