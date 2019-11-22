<?php

namespace App\Jobs;

use App\Article;
use App\Repositories\ElasticsearchRepository;

class ArticleJob extends Job
{
    private $article, $sav;

    public function __construct(Article $article, $sav)
    {
        $this->article = $article;
        $this->$sav = $sav;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(ElasticsearchRepository $elasticRepo)
    {   
        if($this->sav)
            $elasticRepo->newArticle($this->article);
        else $elasticRepo->updateArticle($this->article);
    }
}
