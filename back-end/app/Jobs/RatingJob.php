<?php

namespace App\Jobs;

use App\Rating;
use App\Repositories\ElasticsearchRepository;

class RatingJob extends Job
{
    private $rating;

    public function __construct(Rating $rating)
    {
        $this->rating = $rating;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(ElasticsearchRepository $elasticRepo)
    {   
        $elasticRepo->updateRating($this->rating);
    }
}
