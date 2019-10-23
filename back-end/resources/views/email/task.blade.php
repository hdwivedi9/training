<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<title>NEW TASK</title>
</head>

<body>
	<h3 style='color:blue;'>New Task assigned by {{$name}}</h3>
	
	<ul>Title: {{$task->title}}</ul>
	<ul>Description: {{$task->description}}</ul>
	<ul>Due at: {{$task->due_date}}</ul>
	
	You can view all tasks at <a href="localhost:3000/task/task_list">here</a>
</body>
</html>