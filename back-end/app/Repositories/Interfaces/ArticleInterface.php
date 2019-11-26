<?php

namespace App\Repositories\Interfaces;

use App\Article;
use App\Rating;

interface ArticleInterface
{
    public function search(string $query = ''): array;
    public function newArticle(Article $article);
    public function updateRating(Rating $rating);
    public function groupByTags(): array;
}