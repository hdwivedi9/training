<?php

namespace App\Repositories;

use App\Article;
use Elasticsearch\Client;
use Illuminate\Support\Arr;
use Illuminate\Database\Eloquent\Collection;
use App\Repositories\Interfaces\ArticleInterface;

class ElasticsearchRepository implements ArticleInterface
{
    /** @var \Elasticsearch\Client */
    private $elasticsearch;

    public function __construct(Client $elasticsearch)
    {
        $this->elasticsearch = $elasticsearch;
    }

    public function newArticle(Collection $article)
    {
        $this->elasticsearch->index([
            'index' => $article->getSearchIndex(),
            'type' => $article->getSearchType(),
            'id' => $article->getKey(),
            'body' => $article->toSearchArray(),
        ]);
    }

    public function search(string $query = ''): Collection
    {
        $items = $this->searchOnElasticsearch($query);

        return $this->buildCollection($items);
    }

    private function searchOnElasticsearch(string $query = ''): array
    {
        $model = new Article;

        if($query === ''){
            $items = $this->elasticsearch->search([
                'index' => $model->getSearchIndex(),
                'type' => $model->getSearchType(),
                'body' => [
                    'size' => 100,
                ],
            ]);
            return $items;
        }

        $items = $this->elasticsearch->search([
            'index' => $model->getSearchIndex(),
            'type' => $model->getSearchType(),
            'body' => [
                'size' => 100,
                'query' => [
                    'dis_max' => [
                        'queries' => [
                            [
                                'match' => [
                                    'title' => $query,
                                ]
                            ],
                            [
                                'match' => [
                                    'body' => $query,
                                ]
                            ],
                            [
                                'match' => [
                                    'tags' => $query,
                                ]
                            ],
                        ],
                        'tie_breaker' => 0,
                    ],
                ],
            ],
        ]);

        return $items;
    }

    private function buildCollection(array $items): Collection
    {
        $ids = Arr::pluck($items['hits']['hits'], '_id');

        return Article::findMany($ids)
            ->sortBy(function ($article) use ($ids) {
                return array_search($article->getKey(), $ids);
            });
    }
}