<?php

namespace App\Observers;

use App\Article;
use Elasticsearch\Client;
use App\Jobs\ArticleJob;
use Illuminate\Support\Facades\Queue;

class ElasticsearchObserver
{
    /** @var \Elasticsearch\Client */
    private $elasticsearch;

    public function __construct(Client $elasticsearch)
    {
        $this->elasticsearch = $elasticsearch;
    }

    public function saved($model)
    {
        Queue::push(new ArticleJob($model));
        // $this->elasticsearch->index([
        //     'index' => $model->getSearchIndex(),
        //     'type' => $model->getSearchType(),
        //     'id' => $model->getKey(),
        //     'body' => $model->toSearchArray(),
        // ]);
    }

    public function deleted($model)
    {
        //Queue::push(ArticleJob($model))
        $this->elasticsearch->delete([
            'index' => $model->getSearchIndex(),
            'type' => $model->getSearchType(),
            'id' => $model->getKey(),
        ]);
    }
}