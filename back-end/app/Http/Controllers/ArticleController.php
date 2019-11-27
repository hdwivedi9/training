<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use App\Repositories\Interfaces\ArticleInterface;
use App\Article;
use App\Rating;
use App\User;

class ArticleController extends Controller
{
    private $articleRepository;

    public function __construct(ArticleInterface $articleRepository)
    {
        $this->articleRepository = $articleRepository;
    }

    public function search(Request $request){
        $q = $request->searchQuery;
        $user = $request->auth;
        $sortBy = $request->sort;
        $order = $request->order;
        $sort = ['_score' => $order];
        if($q === null) $q = '';
        if($order === null) $order = 'desc';
        if($sortBy === 'avg_rating') 
            $sort = [
                ['ratings.rating' => ['mode' => 'avg', 'order' => $order, 'nested' => ['path' => 'ratings']]]
            ];
        else if($sortBy === 'title')
            $sort = [
                ['title.keyword' => $order]
            ];
        else if($sortBy === 'my_rating' && $user !== null) 
            $sort = [
                ['ratings.rating' => ['order' => $order, 'nested' => ['path' => 'ratings', 'filter' => ['term' => ['ratings.given_by' => $user->id]]]]]
            ];
        $result = $this->articleRepository->search($q, $sort);
        foreach($result as $k => $r){
            $avg_rating = Article::find($r['id'])->ratings()->avg('rating');
            if(!is_null($avg_rating)){
                $result[$k]['avg_rating'] = round($avg_rating, 2);
            }

            $creator = User::find($r['created_by']);
            if(!is_null($creator)){
                $result[$k]['created_by'] = $creator->name;
            }

            $user = $request->auth;
            if(!empty($user)){
                $curr_rating = $user->ratings->where('article_id', $r['id'])->first();

                if(!is_null($curr_rating))
                    $result[$k]['curr_rating'] = round($curr_rating->rating, 2);
            
            }
        }
        $res['data'] = $result;
        $res['success'] = true;
        $res['message'] = 'Query Successfull';
        return response($res, 200);

    }

    public function groupByTags(){
        $result = $this->articleRepository->groupByTags();
        $res['data'] = $result;
        return response($res, 200);
    }

    public function newArticle(Request $request){
        $article = new Article;
        $article->title = $request->title;
        $article->body = $request->body;
        $article->tags = $request->tags;
        $article->created_by = $request->auth->id;
        $article->save();

        $res['success'] = true;
        $res['message'] = 'Query Successfull';
        return response($res, 200);

    }

    public function newRating(Request $request){
        $user = $request->auth;
        $rating  = new Rating;
        $rating->article_id = $request->article;
        $rating->rating = $request->rating;
        $rating->given_by = $user->id;
        $rating->save();

        $res['success'] = true;
        $res['message'] = 'Query Successfull';
        return response($res, 200);
    }

    public function updateRating(Request $request){
        $user = $request->auth;
        $rating = Rating::where('article_id', $request->article)->where('given_by', $user->id)->first();
        $rating->rating = $request->rating;
        $rating->save();

        $res['success'] = true;
        $res['message'] = 'Query Successfull';
        return response($res, 200);
    }
}
