<?php
	session_start();
	if(!isset($_SESSION['username'])){
		header("Location:login.php");
	}
?>
<html>
<head><link rel="stylesheet" type="text/css" href="css.css"></head>
    <body>
            <div id="div1">

                <a href="index.php" id="home">Home</a>
                <a href="Login.php" id="login2">Login</a>
                <a href="register.php" id="register">Register</a> 


        </div>
        <form action="/logout.php" method="get">
            <input type="submit" name="submit" value="Log Out." action="/logout.php" id="Logout">
        </form>
    </body>
</html>
<?php

?>