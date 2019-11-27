<?php

namespace App\Repositories;

use App\Article;
use App\Rating;
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

    public function newArticle(Article $article)
    {
        $this->elasticsearch->index([
            'index' => $article->getSearchIndex(),
            'type' => $article->getSearchType(),
            'id' => $article->getKey(),
            'body' => $article->toSearchArray(),
        ]);
    }

    public function updateRating(Rating $rating)
    {
        $article = Article::find($rating->article_id);
        $r = $article->ratings->toArray();
        $this->elasticsearch->updateByQuery([
            'index' => $article->getSearchIndex(),
            'type' => $article->getSearchType(),
            'body' => [
                'query' => [
                    'term' => [
                        'id' => $article->getKey(),
                    ],
                ],
                "script" => [
                    "source" => "ctx._source.ratings = params.r",
                    "params" => [
                        "r" => $r, 
                    ]
                ]
            ]
        ]);
    }

    public function search(string $query = '', array $sort = []): array
    {
        $model = new Article;
        if($query === ''){
            $items = $this->elasticsearch->search([
                'index' => $model->getSearchIndex(),
                'type' => $model->getSearchType(),
                'body' => [
                    'size' => 100,
                    'sort' => $sort,
                ],
            ]);
        }
        else {
            $items = $this->elasticsearch->search([
                'index' => $model->getSearchIndex(),
                'type' => $model->getSearchType(),
                'body' => [
                    'size' => 100,
                    'query' => [
                        'simple_query_string' => [
                            'query' => $query,
                            'fields' => ["title^5", "body", "tags^2"],
                            'default_operator' => 'or',
                        ],
                    ],
                    'sort' => $sort,
                ],
            ]);
        }
        $articles = $items['hits']['hits'];
        return Arr::pluck($articles, '_source');
    }

    public function groupByTags(): array
    {
        $model = new Article;
        $items = $this->elasticsearch->search([
            'index' => $model->getSearchIndex(),
            'type' => $model->getSearchType(),
            'body' => [
                'size' => 10,
                'aggs' => [
                    'aggs_tags' => [
                        'terms' => [
                            'field' => 'tags.keyword',
                        ],
                    ],
                ],
            ],
        ]);
        $buckets = $items['aggregations']['aggs_tags']['buckets'];
        return $buckets;
    }
}