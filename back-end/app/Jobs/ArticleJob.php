<?php

namespace App\Jobs;

use App\Repositories\ElasticsearchRepository;

class ArticleJob extends Job
{
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        (new ElasticsearchRepository)->newArticle($article);
    }
}
