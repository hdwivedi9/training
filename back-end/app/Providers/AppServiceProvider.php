<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(
            \App\Repositories\Interfaces\ArticleInterface::class, function () {
                // This is useful in case we want to turn-off our
                // search cluster or when deploying the search
                // to a live, running application at first.
                if (! config('services.search.enabled')) {
                    return new \App\Repositories\ArticleRepository();
                }

                return new \App\Repositories\ElasticsearchRepository(
                    $app->make(Client::class)
                );
            }
        );
        $this->bindSearchClient();
    }
    
    private function bindSearchClient()
    {
        $this->app->bind(Client::class, function ($app) {
            return ClientBuilder::create()
                ->setHosts($app['config']->get('services.search.hosts'))
                ->build();
        });
    }
}
