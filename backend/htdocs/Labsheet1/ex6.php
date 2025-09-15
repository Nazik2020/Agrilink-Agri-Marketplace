<?php
session_start();

//create the session array
if(!isset($_SESSION['attendee'])){
    $_SESSION['attendee']=[]=" ";
}
//defing the varibles and assigh the values to it 
//first it empty
$name=$email=$contact=" ";
$error=[];
$succcessMsg=" ";

//before validate first check whether form sublitted or not
if($_SERVER["REQUEST_METHOD"] === "POST"){
    
}
//get the form info in safe then sanitize all the ifo that get 
$name = htmlspecialchars(trim($_POST['name']));
$email=htmlspeacilachars(trim($_POST['email']));
$contact=htmlspecialchars(trim($_POST['contact']));

//validate the data
if(empty($name)){
    $error[]="name requied";
}
if(empty($email)){
    $error[]="email requied";
}
    elseif(!filter_var($email,FILTER_VALIDATE_EMAIL)){
        $error[]=" invalid email address";
   
}
if(empty($contact)){
    $error[]="contact required";
}
//if there os a no error 
if(empty($error)){
    $attendee=['name'=>$name,'email'=>$email,'contact'=>$contact];
}


?>
<DOCTYPE html>
    <html>
        <head><title>form</title></head>
   
<?php
    // this is not the store the data
if (!empty($errors)) {
    foreach ($errors as $error) {
        echo $error . "<br>";
    }

if (!empty($successMsg)) {
    echo $successMsg . "<br>";
}

 ?>
     <form method="post" action=" ">
         <labe>Name:</label>
         <input type="text" value="name">
         <labe>Email:</label>
         <input type="text" value="email">
         <labe>Contact:</label>
         <input type="text" value="contact">
         
         <input type="submit" value="regiter">
         </form><!-- comment -->

</html>
<?php 
//if this is  seesion array is not empty then it store in a table 
if(!empty($_SESSION['attendee'])){
    echo"<table border='1' celpadding='5'>";
    
    
    
}
    
}


