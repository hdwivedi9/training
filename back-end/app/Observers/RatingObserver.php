<?php

namespace App\Observers;

use Elasticsearch\Client;
use App\Jobs\RatingJob;
use Illuminate\Support\Facades\Queue;

class RatingObserver
{
    /** @var \Elasticsearch\Client */
    private $elasticsearch;

    public function __construct(Client $elasticsearch)
    {
        $this->elasticsearch = $elasticsearch;
    }

    public function saved($model)
    {
        Queue::push(new RatingJob($model));
    }

    public function deleted($model)
    {
        Queue::push(new RatingJob($model));
    }
}