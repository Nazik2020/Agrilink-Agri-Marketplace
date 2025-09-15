<?php
//difine the varibles 
$error=[];
$name=$email=$phone_num=" ";
//check whether the the form submitted or not 
if($SERVER["REQUEST_METHOD"] =="POST"){
//store the inputs
$name=trim($_POST['name']);
$email=trim($_POST['email']);
$phone_no=trim($_POST['phone_no']);
//validate the email
if(!filter_var($email,FILTER_VALIDATE_EMAIL)){
    $errors[]="invalid email address";
}

//sanitize the phone number 
$sanitizedPhone=preg_replace('/\D/','',$phone);//only digits
if (strlen($sanitizedPhone)< 10){
    $error[]="phone number should be 10";   
}
//display the arroee /how to?
if(empty($error)){
    echo "<h3> submitted information</h3>";
    echo "Name:".htmlspeacialchars($name)."<br>";
    echo "email:".htmlspecialchars($email)."<br>";
    echo "phone_no".htmlspcialchars($phone_no)."<br>";
}
else{
    echo "<h3>Error</h3>";
    foreach($error as $errorr){
        echo "<li>".htmlspeacialchars($error)."</li>";
    }
    echo "</ul>";
    
}

?>
<!DOCTYPE html>
<html>
    <head>
        <title>form registration</title>
    </head>
    <body>
        <form method="post" action=" ">
            <label>Name:</label><!-- comment -->
            <input type="text" name="name"><!-- comment --><br><br>
            <label>Email:</label><!-- < -->
            
            
    </body>
</html>

