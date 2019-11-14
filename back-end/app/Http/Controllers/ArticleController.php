<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use App\Repositories\Interfaces\ArticleInterface;
use App\Article;
use App\users;

class ArticleController extends Controller
{
    private $articleRepository;

    public function __construct(ArticleInterface $articleRepository)
    {
        $this->articleRepository = $articleRepository;
    }

    public function search(Request $request){
        $q = $request->searchQuery;
        if($q === null) $q = '';
        $result = $this->articleRepository->search($q);

        foreach($result as $k => $r){
            $user = users::find($r['created_by']);
            if(!is_null($user)){
                $result[$k]['created_by'] = $user->name;
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
        $article->save();

        $res['success'] = true;
        $res['message'] = 'Query Successfull';
        return response($res, 200);

    }
}
