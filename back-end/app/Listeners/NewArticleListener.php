<?php

namespace App\Listeners;

use App\Events\NewArticleEvent;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class NewArticleListener implements ShouldQueue
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  NewArticleEvent  $event
     * @return void
     */
    public function handle(NewArticleEvent $event)
    {
        //
    }
}
