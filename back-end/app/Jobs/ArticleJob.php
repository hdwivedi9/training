<?php

namespace App\Jobs;

use App\Article;
use App\Repositories\ElasticsearchRepository;

class ArticleJob extends Job
{
    private $article;

    public function __construct(Article $article)
    {
        $this->article = $article;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(ElasticsearchRepository $elasticRepo)
    {   
        $elasticRepo->newArticle($this->article);
    }
}
