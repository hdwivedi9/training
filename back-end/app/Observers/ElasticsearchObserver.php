<?php

namespace App\Observers;

use App\Article;
use Elasticsearch\Client;
use App\Jobs\ArticleJob;
use Illuminate\Support\Facades\Queue;
use Carbon\Carbon;

class ElasticsearchObserver
{
    /** @var \Elasticsearch\Client */
    private $elasticsearch;

    public function __construct(Client $elasticsearch)
    {
        $this->elasticsearch = $elasticsearch;
    }

    public function created($model)
    {
        Queue::push(new ArticleJob($model, 1));
    }

    public function updated($model)
    {
        Queue::push(new ArticleJob($model, 0));
    }

    public function deleted($model)
    {
        $this->elasticsearch->delete([
            'index' => $model->getSearchIndex(),
            'type' => $model->getSearchType(),
            'id' => $model->getKey(),
        ]);
    }
}