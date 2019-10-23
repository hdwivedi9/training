<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<title>RESET PASSWORD</title>
</head>

<body>
	<h3 style='color:blue;'>Forgot Password {{$name}} ?</h3>
	
	Don't worry we got you covered.

	To reset your password <a href="localhost:3000/forget/new_pass?token={{$token}}">Click here</a>
</body>
</html>