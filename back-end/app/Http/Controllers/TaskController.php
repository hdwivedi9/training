<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Mail;
use App\Mail\TaskMail;
use App\tasks;
use App\users;

class TaskController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function auth_response(){
        $res['success'] = false;
        $res['message'] = 'Unauthorized request';
        return response($res, 401);
    }

    public function newTask(Request $request){

        $rules = [
            'title'=> 'required|max:200',
            'description'=> 'required|max:10000',
            'assignee'=> 'required|integer|exists:users,id',
            'due_date'=>'required|date|after:now',
        ];

        // $message = [
        //     'date'=>'Please enter date in correct format YYYY-MM-DD hh:mm:ss'
        // ];

        $this->validate($request,$rules);

        $user = $request->auth;
        if($user->role!=='admin' && $user->id!=$request->assignee){
            return TaskController::auth_response();
        }

        $task = new tasks;
        $task->title = $request->title;
        $task->description = $request->description;
        $task->creator = $user->id;
        $task->assignee = $request->assignee;
        $task->assign_date=Carbon::now();
        $task->due_date = $request->due_date;
        $task->save();

        $assignee = users::find($task->assignee);
        Mail::to($assignee->email)->later(1, new TaskMail($task, $user->name));

        $res['success'] = true;
        $res['message'] = 'New task created!';
        return response($res, 200);

    }

    public function updateTask(Request $request){

        $rules = [
            'id'=> 'required|integer|exists:tasks',
            'title'=> 'max:200|nullable',
            'description'=> 'max:10000|nullable',
            'due_date'=>'date|after:now|nullable',
        ];

        // $message = ['date'=>'Please enter date in correct format YYYY-MM-DD hh:mm:ss'];

        $this->validate($request,$rules);

        $user = $request->auth;
        $task = tasks::find($request->id);

        if($user->id !== $task->creator){
            return TaskController::auth_response();
        }

        if($request->title!==null && $request->title!=='')$task->title = $request->title;
        if($request->description!==null && $request->description!=='')$task->description = $request->description;
        if($request->due_date!==null && $request->due_date!=='')$task->due_date = $request->due_date;

        $task->save();

        $res['success'] = true;
        $res['message'] = 'Task updated successfully!';
        return response($res, 200);

    }

    public function deleteTask(Request $request){

        $rules = [
            'id'=> 'required|integer|exists:tasks'
        ];
        $this->validate($request,$rules);

        $user = $request->auth;
        $task = tasks::find($request->id);

        if($user->id !== $task->creator){
            return TaskController::auth_response();
        }

        $task->status='deleted';
        $task->deleted_at=Carbon::now();
        $task->save();

        $res['success'] = true;
        $res['message'] = 'Task deleted successfully!';
        return response($res, 200);
    }
    
    public function taskStatus(Request $request){

        $rules = [
            'id'=> 'required|integer|exists:tasks',
            'status'=> 'required|in:assigned,in-progress,completed'
        ];
        $this->validate($request,$rules);
        $task = tasks::find($request->id);

        $user = $request->auth;

        if($user->id !== $task->assignee){
            return TaskController::auth_response();
        }

        if($task->status!==$request->status){
            $task->status=$request->status;
            $task->updated_at=Carbon::now();
            $task->save();
        }

        $res['success'] = true;
        $res['message'] = 'Task status changed successfully!';
        return response($res, 200);
    }

    public function taskList(Request $request){

        $user = $request->auth;

        $rules = [

        'title'=> 'max:200|nullable',
        'description'=> 'max:10000|nullable',
        'status'=> 'nullable',
        'creator'=> 'max:200|nullable',
        'assignee'=> 'max:200|nullable',
        'action'=> 'in:creator,assignee|nullable'
        // 'created_at'=> 'date|nullable',
        // 'updated_at'=> 'date|nullable',

        ];

        // $message = [
        //     'date'=> 'Please enter the date in YYYY-MM-DD format',

        // ];
        $this->validate($request,$rules);

        $title = $request->title;
        $description = $request->description;
        $status = $request->status;
        $creator = $request->creator;
        $assignee = $request->assignee;
        $action = $request->action;
        $now=Carbon::now();

        $lists = db::table('tasks as t')
            ->join('users as u', 't.creator', '=', 'u.id')
            ->join('users as v', 't.assignee', '=', 'v.id')
            ->select('t.id', 't.title', 't.description', 't.status', 'u.name as creator', 'v.name as assignee', 't.assign_date', 't.due_date', 't.creator as cid', 't.assignee as aid')//->selectRaw('t.due_date < ? as overdue', [$now])
            
            ->where(function($query) use ($user){
                if($user->role !== 'admin') $query->orWhere('creator', '=', $user->id)->orWhere('assignee', '=', $user->id);
            })

            ->where(function($query) use ($user, $action){
                if(!is_null($action)){
                    if($action === 'creator') $query->where('creator', '=', $user->id);
                    else if($action === 'assignee') $query->where('assignee', '=', $user->id);
                }      
            })

            ->where(function($query) use ($title, $description, $status, $creator, $assignee){
                $query->where('t.status', '!=', 'deleted');
                if(!is_null($title)) $query->where('t.title', 'LIKE','%'.$title.'%');
                if(!is_null($description)) $query->where('t.description', 'LIKE','%'.$description.'%');
                if(!is_null($status)) $query->where('t.status', 'LIKE','%'.$status.'%');
                if(!is_null($creator)) $query->where('u.name', 'LIKE','%'.$creator.'%');
                if(!is_null($assignee)) $query->where('v.name', 'LIKE','%'.$assignee.'%');       
            })->orderby('id')->get();

        // $lists = tasks::

        //     where(function($query) use ($user){
        //         if($user->role !== 'admin') $query->orWhere('creator', '=', $user->id)->orWhere('assignee', '=', $user->id);
        //     })
        //     ->whereHas('create', function($query) use ($creator){
        //         if(!is_null($creator)) $query->where('name', 'LIKE','%'.$creator.'%');
        //     })
        //     ->whereHas('assign', function($query) use ($assignee){
        //         if(!is_null($assignee)) $query->where('name', 'LIKE','%'.$assignee.'%');
        //     })
        //     ->where(function($query) use ($title, $description, $status){
        //         if(!is_null($title)) $query->where('title', 'LIKE','%'.$title.'%');
        //         if(!is_null($description)) $query->where('description', 'LIKE','%'.$description.'%');
        //         if(!is_null($status)) $query->where('status', 'LIKE','%'.$status.'%');      
        //     })
        //     ->with('create:id,name','assign:id,name')
        //     ->orderby('id')->paginate(10);

        $res['data']=$lists;
        return response($res,200);
        
    }

    public function highchart(Request $request){

        $user = $request->auth;
        $now=Carbon::now();

        $data = db::table('tasks')
            ->selectRaw('status, count(*) as count, sum(due_date < updated_at) as completed_after_deadline, sum(due_date < ?) as overdue', [$now])
            ->where('assignee', '=', $user->id)->where('status', '!=', 'deleted')
            ->groupBy('status')->orderBy('status')->get();

        $res['data']=$data;
        return response($res,200);

    }
    
}
