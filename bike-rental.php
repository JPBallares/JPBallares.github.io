<?php
	session_start();
	if(!isSet($_SESSION['username'])){
		header("Location:login.php");
	}
?>
<html>

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="theme-color" content="#2196f3">
    <title>Baguio Bike Rental</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/png" href="images/icons/icon-512x512.png">
    <link rel="manifest" href="manifest.json">
    <script src="app.js" async></script>

</head>

<body>
    <div id="div1">

        <a href="index.php" id="home">Home</a>
        <a href="login.php" id="login2">Login</a>
        <a href="register.php" id="register">Register</a>


    </div>
    <form action="/logout.php" method="get">
        <input type="submit" name="submit" value="Log Out." action="/logout.php" id="logout">
    </form>
</body>

</html>