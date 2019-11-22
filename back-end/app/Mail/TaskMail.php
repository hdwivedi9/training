<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Task;

class TaskMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    protected $task;
    protected $name;

    public function __construct(Task $task, $name)
    {
        $this->task = $task;
        $this->name = $name;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('email.task')
            ->subject('NEW TASK')
            ->with([
                'task' => $this->task,
                'name' => $this->name
            ]);
    }
}
